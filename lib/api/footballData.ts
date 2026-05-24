/**
 * Thin wrapper for the football-data.org v4 API.
 *
 * Free-tier limits: 10 requests/minute, public competitions only. We treat
 * 429s as soft failures and return the last cached payload so the UI never
 * goes blank during rate-limit windows.
 *
 * The API key is read at request time from `FOOTBALL_DATA_API_KEY`. If unset,
 * every call resolves to `null` and consumers should fall back to placeholder
 * data — this is the normal pre-key development state.
 */
import { getCache } from "@/lib/cache";

const BASE_URL = "https://api.football-data.org/v4";
const FIFA_WC_2026 = "WC"; // competition code; tournament edition resolved server-side

const DEFAULT_TTL = 30; // live data
const STALE_TTL = 600; // fallback served when upstream errors
const STANDINGS_TTL = 60;

interface FetchOptions {
  /** Cache TTL for the fresh response. */
  ttl?: number;
  /** Optional override key; defaults to the path. */
  cacheKey?: string;
}

export class FootballDataError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "FootballDataError";
  }
}

interface StaleEntry<T> {
  data: T;
  storedAt: string;
}

/**
 * Fetch a path from football-data.org with cache-first behaviour.
 * Returns `null` when the API key is missing — callers handle that as the
 * "no live data available yet" case.
 */
export async function fdGet<T>(path: string, opts: FetchOptions = {}): Promise<T | null> {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) return null;

  const cache = getCache();
  const cacheKey = `fd:${opts.cacheKey ?? path}`;
  const staleKey = `${cacheKey}:stale`;
  const ttl = opts.ttl ?? DEFAULT_TTL;

  const cached = await cache.get<T>(cacheKey);
  if (cached !== null) return cached;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "X-Auth-Token": key },
      // Next caches fetches by default; we manage our own TTL via the cache layer.
      cache: "no-store",
    });

    if (res.status === 429) {
      const stale = await cache.get<StaleEntry<T>>(staleKey);
      if (stale) return stale.data;
      throw new FootballDataError("Rate limited and no cached fallback", 429);
    }

    if (!res.ok) {
      const stale = await cache.get<StaleEntry<T>>(staleKey);
      if (stale) return stale.data;
      throw new FootballDataError(`Upstream ${res.status}`, res.status);
    }

    const data = (await res.json()) as T;
    await cache.set(cacheKey, data, ttl);
    await cache.set<StaleEntry<T>>(
      staleKey,
      { data, storedAt: new Date().toISOString() },
      STALE_TTL,
    );
    return data;
  } catch (err) {
    if (err instanceof FootballDataError) throw err;
    const stale = await cache.get<StaleEntry<T>>(staleKey);
    if (stale) return stale.data;
    throw err;
  }
}

export const TTL = {
  liveMatch: DEFAULT_TTL,
  standings: STANDINGS_TTL,
  stale: STALE_TTL,
};

export const COMPETITION = FIFA_WC_2026;

// ---------- Raw response types (subset we actually use) ----------

export interface FdMatch {
  id: number;
  status: string; // SCHEDULED | LIVE | IN_PLAY | PAUSED | FINISHED | POSTPONED | CANCELLED
  minute?: number | null;
  utcDate: string;
  homeTeam: { id?: number; name: string };
  awayTeam: { id?: number; name: string };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
}

export interface FdMatchDetail extends FdMatch {
  goals?: Array<{
    minute: number;
    team: { name: string };
    scorer: { name: string };
    assist?: { name: string } | null;
    type?: string; // REGULAR | OWN | PENALTY
  }>;
  bookings?: Array<{
    minute: number;
    team: { name: string };
    player: { name: string };
    card: string; // YELLOW | RED
  }>;
}

export interface FdMatchesResponse {
  matches: FdMatch[];
}

export interface FdMatchDetailResponse {
  match: FdMatchDetail;
}

export interface FdStandingsResponse {
  standings: Array<{
    group?: string;
    table: Array<{
      position: number;
      team: { id?: number; name: string };
      playedGames: number;
      won: number;
      draw: number;
      lost: number;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
    }>;
  }>;
}
