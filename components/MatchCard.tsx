"use client";

import Link from "next/link";
import type { LiveMatch, Match } from "@/lib/types";
import { resolveSlot } from "@/lib/teams";
import { formatLocalTime } from "@/lib/datetime";
import { LiveBadge } from "./LiveBadge";

interface Props {
  match: Match;
  tz: string;
  live?: LiveMatch;
}

export function MatchCard({ match, tz, live }: Props) {
  const home = resolveSlot(match.homeSlot);
  const away = resolveSlot(match.awaySlot);
  const showScore =
    live && (live.status === "live" || live.status === "half-time" || live.status === "finished");

  return (
    <Link
      href={`/match/${match.id}`}
      className="group block rounded-xl border border-ink-800 bg-ink-900/60 p-4 transition-colors hover:border-pitch-600/60"
    >
      <div className="mb-3 flex items-center justify-between text-xs text-ink-400">
        <div className="flex items-center gap-2">
          <span className="chip">Group {match.group}</span>
          <span className="text-ink-500">Match {match.matchNumber}</span>
        </div>
        {live ? (
          <LiveBadge status={live.status} minute={live.minute} />
        ) : (
          <time
            dateTime={match.kickoffUTC}
            className="font-medium text-ink-200 tabular-nums"
            suppressHydrationWarning
          >
            {formatLocalTime(match.kickoffUTC, tz)}
          </time>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <TeamLine name={home} slot={match.homeSlot} align="left" />
        {showScore ? (
          <span className="shrink-0 font-mono text-lg font-semibold text-ink-100 tabular-nums">
            {live?.homeScore ?? 0}–{live?.awayScore ?? 0}
          </span>
        ) : (
          <span className="shrink-0 text-xs font-semibold text-ink-500">vs</span>
        )}
        <TeamLine name={away} slot={match.awaySlot} align="right" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-ink-800 pt-2 text-xs text-ink-400">
        <span className="truncate">
          {match.venue.stadium} · {match.venue.city}
        </span>
        {live?.status === "finished" && <span className="shrink-0 text-ink-500">FT</span>}
      </div>
    </Link>
  );
}

function TeamLine({
  name,
  slot,
  align,
}: {
  name: string;
  slot: string;
  align: "left" | "right";
}) {
  const placeholder = name.startsWith("TBD") || name === slot;
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${align === "right" ? "justify-end" : ""}`}
    >
      <span
        className={`truncate text-sm font-semibold ${placeholder ? "text-ink-400" : "text-ink-100"}`}
        title={name}
      >
        {placeholder ? slot : name}
      </span>
    </div>
  );
}
