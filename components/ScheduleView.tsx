"use client";

import { useEffect, useMemo, useState } from "react";
import type { GroupLetter, LiveMatch, Match, Stage } from "@/lib/types";
import { detectUserTimezone, formatLocalDate, localDayKey } from "@/lib/datetime";
import { useLiveData } from "@/lib/hooks/useLiveData";
import { MatchCard } from "./MatchCard";
import { Countdown } from "./Countdown";
import { CountrySelect } from "./CountrySelect";
import { CountryWatchPanel } from "./CountryWatchPanel";
import { GroupsModal } from "./GroupsModal";

interface Props {
  matches: Match[];
  /** "live" when an upstream source provided the schedule; "static" otherwise. */
  source?: "live" | "static";
  /** Human-readable label of the data source for the visible badge. */
  sourceLabel?: string;
}

const STAGE_LABELS: Record<Stage | "all", string> = {
  all: "All stages",
  group: "Group stage",
  "round-of-32": "Round of 32",
  "round-of-16": "Round of 16",
  quarter: "Quarter-finals",
  semi: "Semi-finals",
  third: "Third-place play-off",
  final: "Final",
};

function formatDayHeader(iso: string, tz: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: tz,
  }).format(new Date(iso));
}

export function ScheduleView({ matches, source = "static", sourceLabel }: Props) {
  const [tz, setTz] = useState<string>("UTC");
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<string>("all");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [groupsModal, setGroupsModal] = useState<{ open: boolean; focus: GroupLetter | null }>({
    open: false,
    focus: null,
  });

  useEffect(() => {
    setTz(detectUserTimezone());
    setMounted(true);
  }, []);

  const { data: liveData } = useLiveData<{ matches: LiveMatch[] }>({
    url: "/api/live",
    intervalMs: 30_000,
  });
  const liveByMatchId = useMemo(() => {
    const m = new Map<string, LiveMatch>();
    for (const lm of liveData?.matches ?? []) m.set(lm.matchId, lm);
    return m;
  }, [liveData]);

  const availableStages = useMemo(() => {
    const set = new Set<Stage>();
    for (const m of matches) set.add(m.stage);
    return Array.from(set);
  }, [matches]);

  const dateOptions = useMemo(() => {
    const days = new Set<string>();
    for (const m of matches) {
      if (stage !== "all" && m.stage !== stage) continue;
      days.add(localDayKey(m.kickoffUTC, tz));
    }
    return Array.from(days).sort();
  }, [matches, tz, stage]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stage !== "all" && m.stage !== stage) return false;
      if (date !== "all" && localDayKey(m.kickoffUTC, tz) !== date) return false;
      return true;
    });
  }, [matches, date, stage, tz]);

  // Two bucketing modes:
  //   - "group": bucket by group letter (A → L). Used when the user filters to
  //     Group stage so the page reads Group A, Group B, … like the FIFA layout.
  //   - "date": bucket by local date (default, also any non-group filter).
  type Bucket = { key: string; label: string; groupLetter: GroupLetter | null; matches: Match[] };
  const bucketMode: "group" | "date" = stage === "group" ? "group" : "date";

  const grouped = useMemo<Bucket[]>(() => {
    if (bucketMode === "group") {
      const order: GroupLetter[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
      const buckets = new Map<GroupLetter, Match[]>();
      for (const m of filtered) {
        if (!m.group) continue;
        const arr = buckets.get(m.group) ?? [];
        arr.push(m);
        buckets.set(m.group, arr);
      }
      return order
        .filter((g) => buckets.has(g))
        .map((g) => ({
          key: `group-${g}`,
          label: `Group ${g}`,
          groupLetter: g,
          matches: (buckets.get(g) ?? []).sort((a, b) =>
            a.kickoffUTC.localeCompare(b.kickoffUTC),
          ),
        }));
    }

    const buckets = new Map<string, Match[]>();
    for (const m of filtered) {
      const key = localDayKey(m.kickoffUTC, tz);
      const arr = buckets.get(key) ?? [];
      arr.push(m);
      buckets.set(key, arr);
    }
    return Array.from(buckets.entries())
      .map(([day, ms]) => {
        const sorted = ms.sort((a, b) => a.kickoffUTC.localeCompare(b.kickoffUTC));
        return {
          key: day,
          label: formatDayHeader(`${day}T12:00:00Z`, tz),
          groupLetter: uniqueGroupLetter(sorted),
          matches: sorted,
        };
      })
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [filtered, tz, bucketMode]);

  const firstMatch = useMemo(
    () => [...matches].sort((a, b) => a.kickoffUTC.localeCompare(b.kickoffUTC))[0],
    [matches],
  );

  const resetFilters = () => {
    setDate("all");
    setStage("all");
  };

  return (
    <>
      {firstMatch && (
        <Countdown
          targetUTC={firstMatch.kickoffUTC}
          subtitle={`Opening match · ${firstMatch.venue.stadium}, ${firstMatch.venue.city}`}
        />
      )}

      <section className="container-page py-6">
        <div className="mb-5 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-ink-100 sm:text-3xl">
              Scores &amp; Fixtures
            </h1>
            <SourceBadge source={source} label={sourceLabel} />
          </div>
          <p className="text-sm text-ink-400">
            All {matches.length} group-stage matches — explore by date, stage, and country.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-ink-700 bg-ink-900 p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Stage
              </span>
              <select
                className="select w-full"
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage | "all")}
                aria-label="Filter by stage"
              >
                <option value="all">All stages</option>
                {availableStages.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Date
              </span>
              <select
                className="select w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Filter by date"
              >
                <option value="all">All dates</option>
                {dateOptions.map((d) => (
                  <option key={d} value={d}>
                    {formatLocalDate(`${d}T12:00:00Z`, tz)}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Where to watch
              </span>
              <CountrySelect variant="full" label="Country" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p
              className="flex items-center gap-2 text-xs text-ink-400"
              suppressHydrationWarning
            >
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="h-4 w-4 text-pitch-600"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-13a.75.75 0 0 0-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 1 0 1.06-1.06l-2.78-2.78V5z"
                  clipRule="evenodd"
                />
              </svg>
              Match times shown in your local time
              <span className="font-medium text-ink-200">({mounted ? tz : "your local time"})</span>
            </p>
            {(date !== "all" || stage !== "all") && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-pitch-700 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <CountryWatchPanel />
        </div>

        {grouped.length === 0 ? (
          <div className="rounded-xl border border-ink-700 bg-ink-900 p-10 text-center text-sm text-ink-400">
            No matches match the current filters.{" "}
            <button
              type="button"
              onClick={resetFilters}
              className="ml-1 font-medium text-pitch-700 underline-offset-2 hover:underline"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map((bucket) => (
              <div key={bucket.key} id={bucket.key}>
                <div className="mb-3 flex items-end justify-between gap-2">
                  <h2
                    className="text-base font-semibold text-ink-100 sm:text-lg"
                    suppressHydrationWarning
                  >
                    {bucket.label}
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      setGroupsModal({ open: true, focus: bucket.groupLetter })
                    }
                    className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-pitch-700 hover:bg-pitch-50 hover:underline"
                  >
                    View groups
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                    >
                      <path d="M7.05 3.55a1 1 0 0 1 1.41 0l5.3 5.3a1 1 0 0 1 0 1.42l-5.3 5.3a1 1 0 1 1-1.41-1.41L11.64 10 7.05 5.41a1 1 0 0 1 0-1.41z" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {bucket.matches.map((m) => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      tz={tz}
                      live={liveByMatchId.get(m.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {groupsModal.open && (
        <GroupsModal
          focusedGroup={groupsModal.focus}
          onClose={() => setGroupsModal({ open: false, focus: null })}
        />
      )}
    </>
  );
}

function uniqueGroupLetter(ms: Match[]): GroupLetter | null {
  const set = new Set<GroupLetter>();
  for (const m of ms) if (m.group) set.add(m.group);
  return set.size === 1 ? Array.from(set)[0] : null;
}

function SourceBadge({
  source,
  label,
}: {
  source: "live" | "static";
  label?: string;
}) {
  if (source === "live") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-pitch-600/40 bg-pitch-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-pitch-700"
        title={label ?? "Live upstream feed"}
      >
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-pitch-500 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-pitch-600" />
        </span>
        Live data
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800"
      title={label ?? "Static fallback"}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
      Static schedule
    </span>
  );
}
