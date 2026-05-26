"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LiveMatch, Match, MatchEvent } from "@/lib/types";
import { resolveTeam } from "@/lib/teams";
import { TeamFlag } from "./TeamFlag";
import { detectUserTimezone, formatLocalTime } from "@/lib/datetime";
import { useLiveData } from "@/lib/hooks/useLiveData";
import { LiveBadge } from "./LiveBadge";
import { WhereToWatch } from "./WhereToWatch";
import { MatchHighlights } from "./MatchHighlights";
import { StandingsTable } from "./StandingsTable";
import { MatchCard } from "./MatchCard";

interface Props {
  match: Match;
  /** Other group-stage matches in the same group (excluding this one). */
  relatedMatches: Match[];
}

type TabId = "overview" | "table" | "related" | "highlights";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "table", label: "Table" },
  { id: "related", label: "Related Matches" },
  { id: "highlights", label: "Highlights" },
];

export function MatchDetail({ match, relatedMatches }: Props) {
  const tz = useMemo(() => detectUserTimezone(), []);
  const homeTeam = resolveTeam(match.homeSlot, match.homeName, match.homeCC);
  const awayTeam = resolveTeam(match.awaySlot, match.awayName, match.awayCC);
  const home = homeTeam.name;
  const away = awayTeam.name;

  const { data: live, loading } = useLiveData<LiveMatch>({
    url: `/api/live/${match.id}`,
    intervalMs: 30_000,
  });

  const status = live?.status ?? "scheduled";
  const isFinished = status === "finished";
  const showScore = status === "live" || status === "half-time" || isFinished;

  const [tab, setTab] = useState<TabId>("overview");

  return (
    <section className="container-page space-y-6 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-pitch-700"
      >
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M12.95 16.45a1 1 0 0 1-1.41 0l-5.3-5.3a1 1 0 0 1 0-1.42l5.3-5.3a1 1 0 1 1 1.41 1.41L8.36 10l4.59 4.59a1 1 0 0 1 0 1.41z" />
        </svg>
        Back to fixtures
      </Link>

      <header className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 shadow-sm">
        <div className="px-6 pt-6 sm:px-10 sm:pt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
            {match.group ? `Group ${match.group}` : match.stage} • Match {match.matchNumber}
          </p>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
            <HeroTeam
              name={home}
              slot={match.homeSlot}
              cc={homeTeam.cc}
              placeholder={homeTeam.placeholder}
              align="right"
            />

            <div className="flex flex-col items-center text-center">
              {showScore ? (
                <div className="font-mono text-4xl font-bold tabular-nums text-ink-100 sm:text-5xl">
                  {live?.homeScore ?? 0}
                  <span className="mx-3 text-ink-400">-</span>
                  {live?.awayScore ?? 0}
                </div>
              ) : (
                <time
                  dateTime={match.kickoffUTC}
                  className="font-mono text-4xl font-bold tabular-nums text-ink-100 sm:text-5xl"
                  suppressHydrationWarning
                >
                  {formatLocalTime(match.kickoffUTC, tz)}
                </time>
              )}
              <div className="mt-2 text-xs text-ink-400" suppressHydrationWarning>
                {formatHeroDate(match.kickoffUTC, tz)}
              </div>
              {live ? (
                <div className="mt-2">
                  <LiveBadge status={live.status} minute={live.minute} />
                </div>
              ) : (
                loading && (
                  <div className="mt-2 text-[10px] uppercase tracking-wider text-ink-500">
                    Loading…
                  </div>
                )
              )}
            </div>

            <HeroTeam
              name={away}
              slot={match.awaySlot}
              cc={awayTeam.cc}
              placeholder={awayTeam.placeholder}
              align="left"
            />
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm font-semibold text-ink-200">FIFA World Cup 2026™</div>
            <div className="mt-1 inline-flex items-center gap-2 text-xs text-ink-400">
              <span>{match.venue.city}</span>
              <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-ink-500" />
              <span>{match.venue.stadium}</span>
            </div>
          </div>
        </div>

        <nav
          className="mt-8 flex justify-center gap-1 border-t border-ink-700 px-2 sm:gap-2"
          role="tablist"
          aria-label="Match sections"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                aria-controls={`tab-panel-${t.id}`}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative -mb-px px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors sm:px-5 sm:text-sm ${
                  active
                    ? "text-ink-100"
                    : "text-ink-400 hover:text-ink-200"
                }`}
              >
                {t.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full ${
                    active ? "bg-pitch-600" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </header>

      <div role="tabpanel" id={`tab-panel-${tab}`} className="space-y-6">
        {tab === "overview" && (
          <OverviewPanel
            match={match}
            tz={tz}
            live={live ?? null}
            homeName={home}
            awayName={away}
          />
        )}
        {tab === "table" && (
          <div className="rounded-2xl border border-ink-700 bg-ink-950 p-4 sm:p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-300">
              Group {match.group} table
            </h3>
            {match.group ? (
              <StandingsTable filterGroup={match.group} hideHeader />
            ) : (
              <p className="text-sm text-ink-400">Tables are available during the group stage.</p>
            )}
          </div>
        )}
        {tab === "related" && (
          <div className="space-y-3">
            {relatedMatches.length === 0 ? (
              <div className="rounded-2xl border border-ink-700 bg-ink-900 p-8 text-center text-sm text-ink-400">
                No other matches in this group.
              </div>
            ) : (
              relatedMatches.map((m) => <MatchCard key={m.id} match={m} tz={tz} />)
            )}
          </div>
        )}
        {tab === "highlights" && (
          <MatchHighlights matchId={match.id} isFinished={isFinished} />
        )}
      </div>

      {live && !live.fromApi && (
        <p className="text-xs text-ink-500">
          Live data unavailable — showing scheduled fixture only. Configure{" "}
          <code className="rounded bg-ink-800 px-1">FOOTBALL_DATA_API_KEY</code> to enable.
        </p>
      )}
    </section>
  );
}

function HeroTeam({
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
  return (
    <div
      className={`flex min-w-0 items-center gap-3 sm:gap-5 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      {align === "left" && <TeamFlag cc={cc} size="lg" alt={label} />}
      <span
        className={`truncate text-lg font-bold uppercase tracking-tight sm:text-3xl ${
          placeholder ? "text-ink-400" : "text-ink-100"
        }`}
        title={label}
      >
        {label}
      </span>
      {align === "right" && <TeamFlag cc={cc} size="lg" alt={label} />}
    </div>
  );
}

function OverviewPanel({
  match,
  tz,
  live,
  homeName,
  awayName,
}: {
  match: Match;
  tz: string;
  live: LiveMatch | null;
  homeName: string;
  awayName: string;
}) {
  return (
    <>
      <div className="rounded-2xl border border-ink-700 bg-ink-950 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FactCell label="Competition" value="FIFA World Cup™" />
          <FactCell
            label="Kick Off"
            value={
              <span suppressHydrationWarning>{formatKickoff(match.kickoffUTC, tz)}</span>
            }
          />
          <FactCell label="Location" value={match.venue.stadium} />
          <FactCell label="City" value={match.venue.city} />
        </div>
      </div>

      <WhereToWatch matchId={match.id} />

      {live && (
        <StatsPanel live={live} />
      )}

      <EventsList events={live?.events ?? []} homeName={homeName} awayName={awayName} />
    </>
  );
}

function FactCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-ink-900 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-ink-100">{value}</div>
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
  if (events.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
      <div className="border-b border-ink-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
        Events
      </div>
      <ul className="divide-y divide-ink-700">
        {events.map((e, i) => (
          <li
            key={i}
            className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 px-4 py-2 text-sm"
          >
            <span className="font-mono tabular-nums text-ink-400">
              {e.minute != null ? `${e.minute}'` : "—"}
            </span>
            <span className="truncate">
              <span aria-hidden className="mr-2">
                {eventIcon(e.type)}
              </span>
              <span className="font-medium text-ink-100">{e.player || "Unknown"}</span>
              {e.assist && (
                <span className="ml-1 text-ink-500">(assist: {e.assist})</span>
              )}
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

function StatsPanel({ live }: { live: LiveMatch }) {
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
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-4 text-center">
      <div className="font-mono text-2xl font-bold tabular-nums text-ink-100">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}

function formatHeroDate(iso: string, tz: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: tz,
  }).format(d);
  return date.toUpperCase();
}

function formatKickoff(iso: string, tz: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: tz,
  }).format(d);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  }).format(d);
  return `${date}, ${time}`;
}
