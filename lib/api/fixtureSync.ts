/**
 * Dynamic fixtures source.
 *
 * Treats the static `getGroupStageMatches()` list as the structural backbone
 * (ids, slots, groups, venues) and overlays upstream data — kickoff times AND
 * resolved team names — onto it.
 *
 * Two overlay paths, in priority order:
 *   1. `FIFA_FIXTURES_URL` — any JSON endpoint that returns either a flat
 *      `[{matchNumber, kickoffUTC, homeTeam, awayTeam, homeCC?, awayCC?}]`
 *      array or the FIFA-style `{Results: [{MatchNumber, Date, HomeTeam:
 *      {TeamName:[{Description}]}, …}]}` envelope.
 *   2. `FOOTBALL_DATA_API_KEY` — uses football-data.org v4. Fetches both the
 *      WC standings (to map team→slot via group position) and WC matches
 *      (kickoff times + final team names), then merges by matchNumber.
 *
 * Returns the static list unchanged when neither source is available.
 */
import { getGroupStageMatches } from "@/lib/fixtures";
import { getCache } from "@/lib/cache";
import { teamCountryCode } from "@/lib/teams";
import type { Match } from "@/lib/types";
import { COMPETITION, fdGet, type FdMatchesResponse } from "./footballData";

const FIXTURES_TTL_S = 60 * 60; // 1h
const CACHE_KEY = "fixtures:merged:v2";

export interface FixtureBundle {
  matches: Match[];
  /** "live" when an upstream source provided overlay data; "static" otherwise. */
  source: "live" | "static";
  /** Optional human-readable name of the source for diagnostics. */
  sourceLabel?: string;
}

interface RemoteOverlay {
  matchNumber: number;
  kickoffUTC?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeCC?: string;
  awayCC?: string;
}

// ---------- Source 1: configurable URL ----------

async function fetchFromConfiguredUrl(): Promise<RemoteOverlay[] | null> {
  const url = process.env.FIFA_FIXTURES_URL;
  if (!url) return null;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as unknown;
    return parseOverlays(raw);
  } catch {
    return null;
  }
}

function parseOverlays(raw: unknown): RemoteOverlay[] | null {
  if (!raw || typeof raw !== "object") return null;

  if ("Results" in raw && Array.isArray((raw as { Results: unknown[] }).Results)) {
    return (raw as { Results: unknown[] }).Results
      .map(mapFifaRow)
      .filter((r): r is RemoteOverlay => r !== null);
  }

  if (Array.isArray(raw)) {
    return raw.map(mapFlatRow).filter((r): r is RemoteOverlay => r !== null);
  }

  if ("matches" in raw && Array.isArray((raw as { matches: unknown[] }).matches)) {
    return (raw as { matches: unknown[] }).matches
      .map(mapFlatRow)
      .filter((r): r is RemoteOverlay => r !== null);
  }

  return null;
}

function mapFifaRow(row: unknown): RemoteOverlay | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const matchNumber = Number(r.MatchNumber ?? r.matchNumber);
  if (!Number.isFinite(matchNumber)) return null;
  return {
    matchNumber,
    kickoffUTC: typeof r.Date === "string" ? r.Date : undefined,
    homeTeam: extractFifaTeamName(r.HomeTeam),
    awayTeam: extractFifaTeamName(r.AwayTeam),
  };
}

function extractFifaTeamName(team: unknown): string | undefined {
  if (!team || typeof team !== "object") return undefined;
  const t = team as Record<string, unknown>;
  if (Array.isArray(t.TeamName)) {
    const en = t.TeamName.find(
      (x): x is { Description: string } =>
        !!x && typeof x === "object" && "Description" in (x as object),
    );
    if (en && typeof en.Description === "string") return en.Description;
  }
  if (typeof t.Name === "string") return t.Name;
  if (typeof t.name === "string") return t.name;
  return undefined;
}

function mapFlatRow(row: unknown): RemoteOverlay | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const matchNumber = Number(r.matchNumber ?? r.match_number ?? r.number);
  if (!Number.isFinite(matchNumber)) return null;
  return {
    matchNumber,
    kickoffUTC: typeof r.kickoffUTC === "string" ? r.kickoffUTC : undefined,
    homeTeam: typeof r.homeTeam === "string" ? r.homeTeam : undefined,
    awayTeam: typeof r.awayTeam === "string" ? r.awayTeam : undefined,
    homeCC: typeof r.homeCC === "string" ? r.homeCC : undefined,
    awayCC: typeof r.awayCC === "string" ? r.awayCC : undefined,
  };
}

// ---------- Source 2: football-data.org ----------

interface FdMatchExtended {
  id: number;
  utcDate: string;
  status: string;
  stage?: string;
  group?: string;
  homeTeam: { id?: number; name?: string };
  awayTeam: { id?: number; name?: string };
}

async function fetchFromFootballData(): Promise<RemoteOverlay[] | null> {
  const data = await fdGet<{ matches: FdMatchExtended[] }>(
    `/competitions/${COMPETITION}/matches?season=2026&stage=GROUP_STAGE`,
    {
      ttl: FIXTURES_TTL_S,
      cacheKey: `competition:${COMPETITION}:matches:2026:GROUP_STAGE`,
    },
  );

  // If the GROUP_STAGE filter isn't recognised yet (early in the season),
  // fall back to the full list.
  const matches = data?.matches?.length
    ? data.matches
    : ((
        await fdGet<FdMatchesResponse>(
          `/competitions/${COMPETITION}/matches?season=2026`,
          {
            ttl: FIXTURES_TTL_S,
            cacheKey: `competition:${COMPETITION}:matches:2026:all`,
          },
        )
      )?.matches as FdMatchExtended[] | undefined);

  if (!matches?.length) return null;

  // Take only group-stage matches in date order.
  const groupOnly = matches
    .filter((m) => !m.stage || m.stage === "GROUP_STAGE" || /GROUP/.test(m.stage))
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate));

  return groupOnly.map((m, idx) => ({
    matchNumber: idx + 1,
    kickoffUTC: m.utcDate,
    homeTeam: m.homeTeam?.name,
    awayTeam: m.awayTeam?.name,
  }));
}

// ---------- Merge ----------

function mergeOverlays(base: Match[], overlays: RemoteOverlay[]): Match[] {
  if (overlays.length === 0) return base;
  const byNumber = new Map<number, RemoteOverlay>();
  for (const o of overlays) byNumber.set(o.matchNumber, o);

  return base.map((m) => {
    const o = byNumber.get(m.matchNumber);
    if (!o) return m;
    return {
      ...m,
      kickoffUTC: o.kickoffUTC ?? m.kickoffUTC,
      homeName: o.homeTeam ?? m.homeName,
      awayName: o.awayTeam ?? m.awayName,
      homeCC: o.homeCC ?? (o.homeTeam ? teamCountryCode(o.homeTeam) ?? undefined : m.homeCC),
      awayCC: o.awayCC ?? (o.awayTeam ? teamCountryCode(o.awayTeam) ?? undefined : m.awayCC),
    };
  });
}

// ---------- Public entry point ----------

export async function getDynamicMatchesBundle(): Promise<FixtureBundle> {
  const base = getGroupStageMatches();
  const cache = getCache();
  const cached = await cache.get<FixtureBundle>(CACHE_KEY);
  if (cached) return cached;

  const fromUrl = await fetchFromConfiguredUrl();
  if (fromUrl && fromUrl.length) {
    const bundle: FixtureBundle = {
      matches: mergeOverlays(base, fromUrl),
      source: "live",
      sourceLabel: "Custom JSON source",
    };
    await cache.set(CACHE_KEY, bundle, FIXTURES_TTL_S);
    return bundle;
  }

  const fromFd = await fetchFromFootballData();
  if (fromFd && fromFd.length) {
    const bundle: FixtureBundle = {
      matches: mergeOverlays(base, fromFd),
      source: "live",
      sourceLabel: "football-data.org",
    };
    await cache.set(CACHE_KEY, bundle, FIXTURES_TTL_S);
    return bundle;
  }

  const bundle: FixtureBundle = {
    matches: base,
    source: "static",
    sourceLabel: process.env.FOOTBALL_DATA_API_KEY
      ? "Static — upstream returned no data (no WC 2026 schedule yet, or season filter unsupported)"
      : "Static — set FOOTBALL_DATA_API_KEY or FIFA_FIXTURES_URL to go live",
  };
  // Short cache when static so a freshly-added key picks up quickly.
  await cache.set(CACHE_KEY, bundle, 60);
  return bundle;
}

/** Legacy convenience for call sites that only want the matches. */
export async function getDynamicMatches(): Promise<Match[]> {
  return (await getDynamicMatchesBundle()).matches;
}
