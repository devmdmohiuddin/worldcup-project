"use client";

import Link from "next/link";
import type { LiveMatch, Match, Stage } from "@/lib/types";
import { resolveTeam } from "@/lib/teams";
import { formatLocalTime } from "@/lib/datetime";
import { LiveBadge } from "./LiveBadge";
import { TeamFlag } from "./TeamFlag";

interface Props {
  match: Match;
  tz: string;
  live?: LiveMatch;
}

const STAGE_LABEL: Record<Stage, string> = {
  group: "First Stage",
  "round-of-32": "Round of 32",
  "round-of-16": "Round of 16",
  quarter: "Quarter-finals",
  semi: "Semi-finals",
  third: "Third-place play-off",
  final: "Final",
};

export function MatchCard({ match, tz, live }: Props) {
  const homeTeam = resolveTeam(match.homeSlot, match.homeName, match.homeCC);
  const awayTeam = resolveTeam(match.awaySlot, match.awayName, match.awayCC);
  const home = homeTeam.name;
  const away = awayTeam.name;

  const status = live?.status;
  const isLive = status === "live" || status === "half-time";
  const isFinished = status === "finished";
  const showScore = isLive || isFinished;
  const homeScore = live?.homeScore ?? 0;
  const awayScore = live?.awayScore ?? 0;

  let resultLabel: { text: string; tone: "win" | "draw" | "live" } | null = null;
  if (isFinished) {
    if (homeScore > awayScore) resultLabel = { text: `${home} won`, tone: "win" };
    else if (awayScore > homeScore) resultLabel = { text: `${away} won`, tone: "win" };
    else resultLabel = { text: "Draw", tone: "draw" };
  } else if (isLive) {
    resultLabel = { text: "Live", tone: "live" };
  }

  const ariaLabel = showScore
    ? `${home} ${homeScore}–${awayScore} ${away}, ${isFinished ? "full time" : `${live?.minute ?? 0} minute`}`
    : `${home} versus ${away}, kick-off at ${formatLocalTime(match.kickoffUTC, tz)}`;

  return (
    <Link
      href={`/match/${match.id}`}
      aria-label={ariaLabel}
      className="group block rounded-xl border border-ink-700 bg-ink-900 px-4 py-4 transition-all hover:border-pitch-500/70 hover:shadow-md focus-visible:border-pitch-500 sm:px-6 sm:py-5"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <TeamSide
          name={home}
          slot={match.homeSlot}
          cc={homeTeam.cc}
          placeholder={homeTeam.placeholder}
          align="right"
        />

        <div className="flex min-w-[5.5rem] flex-col items-center justify-center text-center sm:min-w-[7rem]">
          {showScore ? (
            <div className="font-mono text-2xl font-bold tabular-nums text-ink-100 sm:text-3xl">
              {homeScore}
              <span className="mx-2 text-ink-500">-</span>
              {awayScore}
            </div>
          ) : (
            <time
              dateTime={match.kickoffUTC}
              className="font-mono text-2xl font-bold tabular-nums text-ink-100 sm:text-3xl"
              suppressHydrationWarning
            >
              {formatLocalTime(match.kickoffUTC, tz)}
            </time>
          )}
          {isLive && live?.status && (
            <div className="mt-1">
              <LiveBadge status={live.status} minute={live.minute} />
            </div>
          )}
          {isFinished && (
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Full time
            </div>
          )}
        </div>

        <TeamSide
          name={away}
          slot={match.awaySlot}
          cc={awayTeam.cc}
          placeholder={awayTeam.placeholder}
          align="left"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-ink-400">
        <span>{STAGE_LABEL[match.stage]}</span>
        {match.group && (
          <>
            <Dot />
            <span>Group {match.group}</span>
          </>
        )}
        <Dot />
        <span className="truncate">
          {match.venue.stadium} ({match.venue.city})
        </span>
      </div>

      {(resultLabel || isFinished) && (
        <div className="mt-3 flex items-center justify-center gap-3 border-t border-ink-700 pt-3 text-xs">
          {resultLabel && (
            <span
              className={
                resultLabel.tone === "win"
                  ? "inline-flex items-center gap-1 font-semibold text-pitch-700"
                  : resultLabel.tone === "draw"
                    ? "inline-flex items-center gap-1 font-semibold text-ink-300"
                    : "inline-flex items-center gap-1 font-semibold text-red-700"
              }
            >
              {resultLabel.text}
            </span>
          )}
          {isFinished && (
            <>
              <Dot />
              <span className="inline-flex items-center gap-1 font-medium text-pitch-700 group-hover:underline">
                Highlights
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="h-3 w-3"
                  fill="currentColor"
                >
                  <path d="M7.05 3.55a1 1 0 0 1 1.41 0l5.3 5.3a1 1 0 0 1 0 1.42l-5.3 5.3a1 1 0 1 1-1.41-1.41L11.64 10 7.05 5.41a1 1 0 0 1 0-1.41z" />
                </svg>
              </span>
            </>
          )}
        </div>
      )}
    </Link>
  );
}

function TeamSide({
  name,
  slot,
  cc,
  placeholder,
  align,
}: {
  name: string;
  slot: string;
  cc: string | null;
  placeholder: boolean;
  align: "left" | "right";
}) {
  const label = placeholder ? slot : name;
  const flag = <TeamFlag cc={cc} size="md" alt={label} />;
  const nameEl = (
    <span
      className={`truncate text-sm font-semibold sm:text-base ${
        placeholder ? "text-ink-400" : "text-ink-100"
      }`}
      title={label}
    >
      {label}
    </span>
  );
  return (
    <div
      className={`flex min-w-0 items-center gap-2 sm:gap-3 ${
        align === "right" ? "justify-end" : "justify-start flex-row-reverse sm:flex-row"
      }`}
    >
      {align === "right" ? (
        <>
          {nameEl}
          {flag}
        </>
      ) : (
        <>
          {flag}
          {nameEl}
        </>
      )}
    </div>
  );
}

function Dot() {
  return (
    <span aria-hidden className="text-ink-500">
      ·
    </span>
  );
}
