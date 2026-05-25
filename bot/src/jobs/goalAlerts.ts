import type { BotApp, BotDeps } from "../context.js";
import { getLiveWindowMatches } from "../data/fixtures.js";
import { resolveSlot } from "../data/teams.js";
import type { LiveMatch, Match, MatchEvent } from "../data/types.js";
import { getStrings } from "../i18n/index.js";
import type { UserPrefs } from "../services/storage.js";

interface MatchSnapshot {
  status: LiveMatch["status"];
  homeScore: number | null;
  awayScore: number | null;
  eventKeys: Set<string>;
}

function eventKey(e: MatchEvent): string {
  return `${e.minute ?? "?"}:${e.side}:${e.type}:${e.player}`;
}

/**
 * Poll football-data.org for matches in the ±3h live window. On each scoring
 * event we haven't seen before, push an alert to every subscribed user. Sends
 * only to:
 *   - users with goalAlerts on (broadcast subscribers) — for any goal
 *   - users with a favouriteTeamSlot matching home/away — even if alerts off,
 *     they still get their team's goals (they explicitly opted in by setting a
 *     favourite)
 *
 * Clean note: we don't push betting odds, gambling promos, or third-party ads.
 */
export function startGoalAlerts(app: BotApp, deps: BotDeps): void {
  const { config, fdClient, store } = deps;
  if (!fdClient.enabled) {
    console.warn("[goalAlerts] FOOTBALL_DATA_API_KEY not set — alerts disabled");
    return;
  }

  const snapshots = new Map<string, MatchSnapshot>();
  const intervalMs = Math.max(30, config.pollIntervalSec) * 1000;

  async function tick(): Promise<void> {
    const matches = getLiveWindowMatches();
    if (matches.length === 0) return;

    const liveById = new Map<string, LiveMatch>();
    for (const m of matches) {
      try {
        liveById.set(m.id, await fdClient.getLiveMatch(m.id));
      } catch (err) {
        console.warn("[goalAlerts] fetch failed:", err);
      }
    }

    const users = await store.all();

    for (const m of matches) {
      const live = liveById.get(m.id);
      if (!live) continue;
      const prev = snapshots.get(m.id);
      const nextEventKeys = new Set(live.events.map(eventKey));

      if (
        prev &&
        prev.status === "scheduled" &&
        (live.status === "live" || live.status === "half-time")
      ) {
        await notifyMatchStarted(app, m, users);
      }

      if (prev) {
        for (const ev of live.events) {
          if (ev.type !== "goal" && ev.type !== "penalty" && ev.type !== "own-goal") continue;
          if (prev.eventKeys.has(eventKey(ev))) continue;
          await notifyGoal(app, m, live, ev, users);
        }
      }

      snapshots.set(m.id, {
        status: live.status,
        homeScore: live.homeScore,
        awayScore: live.awayScore,
        eventKeys: nextEventKeys,
      });
    }
  }

  void tick();
  setInterval(() => {
    tick().catch((err) => console.error("[goalAlerts] tick failed:", err));
  }, intervalMs);
}

function recipientsFor(match: Match, users: UserPrefs[]): UserPrefs[] {
  return users.filter((u) => {
    if (u.goalAlerts) return true;
    return u.favoriteTeamSlot === match.homeSlot || u.favoriteTeamSlot === match.awaySlot;
  });
}

async function notifyMatchStarted(app: BotApp, match: Match, users: UserPrefs[]): Promise<void> {
  const home = resolveSlot(match.homeSlot);
  const away = resolveSlot(match.awaySlot);
  for (const u of recipientsFor(match, users)) {
    const s = getStrings(u.language);
    const body = `${s.matchStartedHeader}\n${home} vs ${away}\n${s.whereToWatch.replace("{matchId}", match.id)}`;
    try {
      await app.telegram.sendMessage(u.chatId, body);
    } catch (err) {
      console.warn(`[goalAlerts] kickoff send failed for ${u.chatId}:`, err);
    }
  }
}

async function notifyGoal(
  app: BotApp,
  match: Match,
  live: LiveMatch,
  ev: MatchEvent,
  users: UserPrefs[],
): Promise<void> {
  const home = resolveSlot(match.homeSlot);
  const away = resolveSlot(match.awaySlot);
  const scorer = ev.player || (ev.type === "own-goal" ? "OG" : "");
  const minute = ev.minute != null ? `${ev.minute}'` : "";
  const scoreline = `${home} ${live.homeScore ?? 0}–${live.awayScore ?? 0} ${away}`;

  for (const u of recipientsFor(match, users)) {
    const s = getStrings(u.language);
    const lines = [
      s.goalAlertHeader,
      scoreline,
      [minute, scorer].filter(Boolean).join(" "),
      s.whereToWatch.replace("{matchId}", match.id),
    ].filter(Boolean);
    try {
      await app.telegram.sendMessage(u.chatId, lines.join("\n"));
    } catch (err) {
      console.warn(`[goalAlerts] goal send failed for ${u.chatId}:`, err);
    }
  }
}
