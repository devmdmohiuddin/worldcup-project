import { resolveSlot } from "../data/teams.js";
import { getGroupStageMatches } from "../data/fixtures.js";
import type { LiveMatch, MatchEvent, MatchStatus } from "../data/types.js";

const BASE_URL = "https://api.football-data.org/v4";
const COMPETITION = "WC";
const COMPETITION_TTL_MS = 5 * 60 * 1000;
const MATCH_TTL_MS = 30 * 1000;

interface CacheEntry<T> { data: T; expires: number }

interface FdMatch {
  id: number;
  status: string;
  minute?: number | null;
  utcDate: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

interface FdMatchDetail extends FdMatch {
  goals?: Array<{
    minute: number;
    team: { name: string };
    scorer: { name: string };
    assist?: { name: string } | null;
    type?: string;
  }>;
  bookings?: Array<{
    minute: number;
    team: { name: string };
    player: { name: string };
    card: string;
  }>;
}

export class FootballDataClient {
  private competitionMap: CacheEntry<Map<string, number>> | null = null;
  private matchCache: Map<number, CacheEntry<FdMatchDetail>> = new Map();

  constructor(private apiKey: string | null) {}

  get enabled(): boolean { return this.apiKey !== null; }

  private async fetchJson<T>(path: string): Promise<T | null> {
    if (!this.apiKey) return null;
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "X-Auth-Token": this.apiKey },
      });
      if (res.status === 429) {
        console.warn("[footballData] rate limited:", path);
        return null;
      }
      if (!res.ok) {
        console.warn("[footballData] upstream", res.status, path);
        return null;
      }
      return (await res.json()) as T;
    } catch (err) {
      console.warn("[footballData] fetch failed:", err);
      return null;
    }
  }

  private async loadCompetitionMap(): Promise<Map<string, number> | null> {
    const now = Date.now();
    if (this.competitionMap && this.competitionMap.expires > now) {
      return this.competitionMap.data;
    }
    const data = await this.fetchJson<{ matches: FdMatch[] }>(
      `/competitions/${COMPETITION}/matches`,
    );
    if (!data) return null;
    const byKey = new Map<string, number>();
    for (const m of data.matches) {
      byKey.set(this.upstreamKey(m.homeTeam.name, m.awayTeam.name, m.utcDate), m.id);
    }
    this.competitionMap = { data: byKey, expires: now + COMPETITION_TTL_MS };
    return byKey;
  }

  private upstreamKey(home: string, away: string, utcDate: string): string {
    return `${utcDate.slice(0, 10)}::${home}::${away}`;
  }

  private mapStatus(raw: string): MatchStatus {
    switch (raw) {
      case "IN_PLAY":
      case "LIVE": return "live";
      case "PAUSED": return "half-time";
      case "FINISHED": return "finished";
      case "POSTPONED": return "postponed";
      case "CANCELLED":
      case "SUSPENDED": return "cancelled";
      default: return "scheduled";
    }
  }

  private detailToLive(matchId: string, detail: FdMatchDetail): LiveMatch {
    const events: MatchEvent[] = [];
    for (const g of detail.goals ?? []) {
      const isOwn = g.type === "OWN";
      events.push({
        minute: g.minute ?? null,
        side: detail.homeTeam.name === g.team.name ? "home" : "away",
        type: isOwn ? "own-goal" : g.type === "PENALTY" ? "penalty" : "goal",
        player: g.scorer?.name ?? "",
        assist: g.assist?.name ?? undefined,
      });
    }
    for (const b of detail.bookings ?? []) {
      events.push({
        minute: b.minute ?? null,
        side: detail.homeTeam.name === b.team.name ? "home" : "away",
        type: b.card === "RED" ? "red" : "yellow",
        player: b.player?.name ?? "",
      });
    }
    events.sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));
    return {
      matchId,
      status: this.mapStatus(detail.status),
      homeScore: detail.score.fullTime.home,
      awayScore: detail.score.fullTime.away,
      minute: detail.minute ?? null,
      events,
      fetchedAt: new Date().toISOString(),
      fromApi: true,
    };
  }

  private placeholder(matchId: string): LiveMatch {
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

  async getLiveMatch(matchId: string): Promise<LiveMatch> {
    if (!this.apiKey) return this.placeholder(matchId);
    const scheduled = getGroupStageMatches().find((m) => m.id === matchId);
    if (!scheduled) return this.placeholder(matchId);

    const map = await this.loadCompetitionMap();
    if (!map) return this.placeholder(matchId);

    const upstreamId = map.get(this.upstreamKey(
      resolveSlot(scheduled.homeSlot),
      resolveSlot(scheduled.awaySlot),
      scheduled.kickoffUTC,
    ));
    if (!upstreamId) return this.placeholder(matchId);

    const now = Date.now();
    const cached = this.matchCache.get(upstreamId);
    if (cached && cached.expires > now) return this.detailToLive(matchId, cached.data);

    const detail = await this.fetchJson<{ match: FdMatchDetail }>(`/matches/${upstreamId}`);
    if (!detail) {
      if (cached) return this.detailToLive(matchId, cached.data);
      return this.placeholder(matchId);
    }
    this.matchCache.set(upstreamId, { data: detail.match, expires: now + MATCH_TTL_MS });
    return this.detailToLive(matchId, detail.match);
  }

  async getLiveMatchesForIds(ids: string[]): Promise<LiveMatch[]> {
    const out: LiveMatch[] = [];
    for (const id of ids) out.push(await this.getLiveMatch(id));
    return out;
  }
}
