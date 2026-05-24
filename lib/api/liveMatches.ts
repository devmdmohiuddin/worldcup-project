/**
 * Live-data service. Merges our scheduled fixtures with the upstream feed and
 * returns a uniform `LiveMatch` shape. When no API key is configured, every
 * match resolves to a deterministic "scheduled" placeholder so the UI stays
 * functional in development and pre-tournament.
 */
import { getGroupStageMatches } from "@/lib/fixtures";
import { resolveSlot } from "@/lib/teams";
import type { LiveMatch, MatchEvent, MatchStatus } from "@/lib/types";
import {
  COMPETITION,
  fdGet,
  TTL,
  type FdMatchDetail,
  type FdMatchDetailResponse,
  type FdMatchesResponse,
} from "./footballData";

function placeholderFor(matchId: string): LiveMatch {
  return {
    matchId,
    status: "scheduled",
    homeScore: null,
    awayScore: null,
    minute: null,
    events: [],
    fetchedAt: new Date().toISOString(),
    fromApi: false,
  };
}

function mapStatus(raw: string): MatchStatus {
  switch (raw) {
    case "IN_PLAY":
    case "LIVE":
      return "live";
    case "PAUSED":
      return "half-time";
    case "FINISHED":
      return "finished";
    case "POSTPONED":
      return "postponed";
    case "CANCELLED":
    case "SUSPENDED":
      return "cancelled";
    default:
      return "scheduled";
  }
}

function sideFor(detail: FdMatchDetail, teamName: string): "home" | "away" {
  return detail.homeTeam.name === teamName ? "home" : "away";
}

function detailToLive(matchId: string, detail: FdMatchDetail): LiveMatch {
  const events: MatchEvent[] = [];
  for (const g of detail.goals ?? []) {
    const isOwn = g.type === "OWN";
    events.push({
      minute: g.minute ?? null,
      side: sideFor(detail, g.team.name),
      type: isOwn ? "own-goal" : g.type === "PENALTY" ? "penalty" : "goal",
      player: g.scorer?.name ?? "",
      assist: g.assist?.name ?? undefined,
    });
  }
  for (const b of detail.bookings ?? []) {
    events.push({
      minute: b.minute ?? null,
      side: sideFor(detail, b.team.name),
      type: b.card === "RED" ? "red" : "yellow",
      player: b.player?.name ?? "",
    });
  }
  events.sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));

  return {
    matchId,
    status: mapStatus(detail.status),
    homeScore: detail.score.fullTime.home,
    awayScore: detail.score.fullTime.away,
    minute: detail.minute ?? null,
    events,
    fetchedAt: new Date().toISOString(),
    fromApi: true,
  };
}

/**
 * Build a key for matching our scheduled match against an upstream entry.
 * We use kickoff date + both team names (resolved from slots).
 */
function upstreamKey(homeName: string, awayName: string, utcDateISO: string): string {
  return `${utcDateISO.slice(0, 10)}::${homeName}::${awayName}`;
}

let competitionMatchesCache: { byKey: Map<string, number>; fetchedAt: number } | null = null;

async function loadCompetitionMatchMap(): Promise<Map<string, number> | null> {
  // Refresh every 5 minutes — fixture list is essentially static during the tournament.
  if (competitionMatchesCache && Date.now() - competitionMatchesCache.fetchedAt < 5 * 60 * 1000) {
    return competitionMatchesCache.byKey;
  }
  const data = await fdGet<FdMatchesResponse>(`/competitions/${COMPETITION}/matches`, {
    ttl: 300,
    cacheKey: `competition:${COMPETITION}:matches`,
  });
  if (!data) return null;
  const byKey = new Map<string, number>();
  for (const m of data.matches) {
    byKey.set(upstreamKey(m.homeTeam.name, m.awayTeam.name, m.utcDate), m.id);
  }
  competitionMatchesCache = { byKey, fetchedAt: Date.now() };
  return byKey;
}

export async function getLiveMatch(matchId: string): Promise<LiveMatch> {
  const scheduled = getGroupStageMatches().find((m) => m.id === matchId);
  if (!scheduled) return placeholderFor(matchId);

  const map = await loadCompetitionMatchMap();
  if (!map) return placeholderFor(matchId);

  const home = resolveSlot(scheduled.homeSlot);
  const away = resolveSlot(scheduled.awaySlot);
  const upstreamId = map.get(upstreamKey(home, away, scheduled.kickoffUTC));
  if (!upstreamId) return placeholderFor(matchId);

  const detail = await fdGet<FdMatchDetailResponse>(`/matches/${upstreamId}`, {
    ttl: TTL.liveMatch,
    cacheKey: `match:${upstreamId}`,
  });
  if (!detail) return placeholderFor(matchId);
  return detailToLive(matchId, detail.match);
}

export async function getLiveMatchesForToday(): Promise<LiveMatch[]> {
  const scheduled = getGroupStageMatches();
  const map = await loadCompetitionMatchMap();
  if (!map) return scheduled.map((m) => placeholderFor(m.id));

  // Only fetch detail for matches that are within a sensible live window
  // (kickoff ± 3h). Cuts API usage to a handful of requests per minute.
  const now = Date.now();
  const inWindow = scheduled.filter((m) => {
    const t = new Date(m.kickoffUTC).getTime();
    return Math.abs(now - t) < 3 * 60 * 60 * 1000;
  });

  const results: LiveMatch[] = [];
  for (const m of inWindow) {
    results.push(await getLiveMatch(m.id));
  }
  return results;
}

export function isMatchLive(live: LiveMatch): boolean {
  return live.status === "live" || live.status === "half-time";
}
