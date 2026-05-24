"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { LiveMatch, Match, MatchEvent } from "@/lib/types";
import { resolveSlot } from "@/lib/teams";
import { detectUserTimezone, formatLocalDateTime } from "@/lib/datetime";
import { useLiveData } from "@/lib/hooks/useLiveData";
import { useMatchConflicts } from "@/lib/hooks/useMatchConflicts";
import { LiveBadge } from "./LiveBadge";
import { WhereToWatch } from "./WhereToWatch";
import { MatchHighlights } from "./MatchHighlights";
import { PrayerConflictBadge } from "./PrayerConflictBadge";

interface Props {
  match: Match;
}

export function MatchDetail({ match }: Props) {
  const tz = useMemo(() => detectUserTimezone(), []);
  const home = resolveSlot(match.homeSlot);
  const away = resolveSlot(match.awaySlot);

  const singleMatchList = useMemo(() => [match], [match]);
  const conflicts = useMatchConflicts(singleMatchList);
  const conflict = conflicts.get(match.id);

  const { data: live, loading } = useLiveData<LiveMatch>({
    url: `/api/live/${match.id}`,
    intervalMs: 30_000,
  });

  const status = live?.status ?? "scheduled";
  const showScore = status === "live" || status === "half-time" || status === "finished";

  return (
    <section className="container-page space-y-6 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-pitch-400"
      >
        ← Back to schedule
      </Link>

      <header className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6">
        <div className="mb-4 flex items-center justify-between text-xs text-ink-400">
          <div className="flex items-center gap-2">
            <span className="chip">Group {match.group}</span>
            <span>Match {match.matchNumber}</span>
          </div>
          {live ? (
            <LiveBadge status={live.status} minute={live.minute} />
          ) : (
            <span className="text-ink-500">{loading ? "Loading…" : "Scheduled"}</span>
          )}
        </div>

        <div className="grid grid-cols-3 items-center gap-3">
          <TeamBig name={home} slot={match.homeSlot} align="right" />
          <div className="text-center">
            {showScore ? (
              <div className="font-mono text-4xl font-bold tabular-nums text-ink-100">
                {live?.homeScore ?? 0}
                <span className="mx-2 text-ink-500">–</span>
                {live?.awayScore ?? 0}
              </div>
            ) : (
              <div className="text-sm font-semibold uppercase tracking-wider text-ink-400">vs</div>
            )}
            {status === "finished" && (
              <div className="mt-1 text-xs uppercase tracking-wider text-ink-500">Full time</div>
            )}
          </div>
          <TeamBig name={away} slot={match.awaySlot} align="left" />
        </div>

        <div className="text-ink-300 mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">Kick-off</div>
            <div suppressHydrationWarning>{formatLocalDateTime(match.kickoffUTC, tz)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">Venue</div>
            <div>
              {match.venue.stadium} · {match.venue.city}, {match.venue.country}
            </div>
          </div>
        </div>

        {conflict && (
          <div className="mt-4 flex items-center gap-2">
            <PrayerConflictBadge conflict={conflict} />
          </div>
        )}
      </header>

      <WhereToWatch matchId={match.id} />

      <MatchHighlights matchId={match.id} isFinished={status === "finished"} />

      <EventsList events={live?.events ?? []} homeName={home} awayName={away} />

      <StatsPanel live={live} />

      {live && !live.fromApi && (
        <p className="text-xs text-ink-500">
          Live data unavailable — showing scheduled fixture only. Configure{" "}
          <code className="rounded bg-ink-800 px-1">FOOTBALL_DATA_API_KEY</code> to enable.
        </p>
      )}
    </section>
  );
}

function TeamBig({ name, slot, align }: { name: string; slot: string; align: "left" | "right" }) {
  const placeholder = name.startsWith("TBD") || name === slot;
  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : "text-left"}`}>
      <div
        className={`truncate text-xl font-bold sm:text-2xl ${
          placeholder ? "text-ink-400" : "text-ink-100"
        }`}
        title={name}
      >
        {placeholder ? slot : name}
      </div>
    </div>
  );
}

function EventsList({
  events,
  homeName,
  awayName,
}: {
  events: MatchEvent[];
  homeName: string;
  awayName: string;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-6 text-center text-sm text-ink-400">
        No events yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-ink-800 bg-ink-900/40">
      <div className="border-b border-ink-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
        Events
      </div>
      <ul className="divide-y divide-ink-800">
        {events.map((e, i) => (
          <li
            key={i}
            className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 px-4 py-2 text-sm"
          >
            <span className="font-mono tabular-nums text-ink-400">
              {e.minute != null ? `${e.minute}'` : "—"}
            </span>
            <span className="truncate">
              <span className="mr-2">{eventIcon(e.type)}</span>
              <span className="font-medium text-ink-100">{e.player || "Unknown"}</span>
              {e.assist && <span className="ml-1 text-ink-500">(assist: {e.assist})</span>}
            </span>
            <span className="text-xs uppercase tracking-wider text-ink-500">
              {e.side === "home" ? homeName : awayName}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function eventIcon(type: MatchEvent["type"]): string {
  switch (type) {
    case "goal":
    case "penalty":
      return "⚽";
    case "own-goal":
      return "🥅";
    case "yellow":
      return "🟨";
    case "red":
      return "🟥";
  }
}

function StatsPanel({ live }: { live: LiveMatch | null }) {
  if (!live) return null;
  const goals = live.events.filter(
    (e) => e.type === "goal" || e.type === "penalty" || e.type === "own-goal",
  );
  const yellows = live.events.filter((e) => e.type === "yellow").length;
  const reds = live.events.filter((e) => e.type === "red").length;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Stat label="Goals" value={goals.length} />
      <Stat label="Yellow cards" value={yellows} />
      <Stat label="Red cards" value={reds} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-4 text-center">
      <div className="font-mono text-2xl font-bold tabular-nums text-ink-100">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}
