"use client";

import { useEffect, useMemo, useState } from "react";
import type { GroupLetter, LiveMatch, Match } from "@/lib/types";
import { allTeams } from "@/lib/teams";
import { detectUserTimezone, formatLocalDate, localDayKey } from "@/lib/datetime";
import { useLiveData } from "@/lib/hooks/useLiveData";
import { useLocale } from "@/lib/hooks/useLocale";
import { useMatchConflicts } from "@/lib/hooks/useMatchConflicts";
import { MatchCard } from "./MatchCard";
import { PrayerTimesWidget } from "./PrayerTimesWidget";

interface Props {
  matches: Match[];
}

type StageFilter = "all" | "group";

const GROUPS: (GroupLetter | "all")[] = [
  "all",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
];

export function ScheduleView({ matches }: Props) {
  const { t } = useLocale();
  const [tz, setTz] = useState<string>("UTC");
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<StageFilter>("all");
  const [group, setGroup] = useState<GroupLetter | "all">("all");
  const [team, setTeam] = useState<string>("all");
  const [date, setDate] = useState<string>("all");
  const [hideConflicts, setHideConflicts] = useState(false);

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
  const conflictByMatchId = useMatchConflicts(matches);

  const teams = useMemo(() => {
    const seen = new Set<string>();
    const list: { label: string; value: string }[] = [];
    for (const t of allTeams()) {
      if (seen.has(t.name)) continue;
      seen.add(t.name);
      list.push({ label: t.name, value: t.slot });
    }
    return list.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const dateOptions = useMemo(() => {
    const days = new Set<string>();
    for (const m of matches) days.add(localDayKey(m.kickoffUTC, tz));
    return Array.from(days).sort();
  }, [matches, tz]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stage !== "all" && m.stage !== stage) return false;
      if (group !== "all" && m.group !== group) return false;
      if (team !== "all" && m.homeSlot !== team && m.awaySlot !== team) return false;
      if (date !== "all" && localDayKey(m.kickoffUTC, tz) !== date) return false;
      if (hideConflicts && conflictByMatchId.has(m.id)) return false;
      return true;
    });
  }, [matches, stage, group, team, date, tz, hideConflicts, conflictByMatchId]);

  const grouped = useMemo(() => {
    const buckets = new Map<string, Match[]>();
    for (const m of filtered) {
      const key = localDayKey(m.kickoffUTC, tz);
      const arr = buckets.get(key) ?? [];
      arr.push(m);
      buckets.set(key, arr);
    }
    return Array.from(buckets.entries())
      .map(([day, ms]) => ({
        day,
        matches: ms.sort((a, b) => a.kickoffUTC.localeCompare(b.kickoffUTC)),
      }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [filtered, tz]);

  const resetFilters = () => {
    setStage("all");
    setGroup("all");
    setTeam("all");
    setDate("all");
    setHideConflicts(false);
  };

  const hasActiveFilter =
    stage !== "all" || group !== "all" || team !== "all" || date !== "all" || hideConflicts;

  return (
    <section className="container-page py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("schedule.title")}</h1>
        <p className="mt-1 text-sm text-ink-400" suppressHydrationWarning>
          {t("schedule.timesIn", { count: matches.length })}{" "}
          <span className="font-medium text-ink-200">{mounted ? tz : "your local time"}</span>
        </p>
      </div>

      <div className="mb-6">
        <PrayerTimesWidget />
      </div>

      <div className="mb-6 rounded-xl border border-ink-800 bg-ink-900/40 p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <FilterSelect
            label={t("schedule.date")}
            value={date}
            onChange={setDate}
            options={[
              { label: t("schedule.allDates"), value: "all" },
              ...dateOptions.map((d) => ({
                label: formatLocalDate(`${d}T12:00:00Z`, tz),
                value: d,
              })),
            ]}
          />
          <FilterSelect
            label={t("schedule.group")}
            value={group}
            onChange={(v) => setGroup(v as GroupLetter | "all")}
            options={GROUPS.map((g) => ({
              label: g === "all" ? t("schedule.allGroups") : `${t("schedule.group")} ${g}`,
              value: g,
            }))}
          />
          <FilterSelect
            label={t("schedule.team")}
            value={team}
            onChange={setTeam}
            options={[
              { label: t("schedule.allTeams"), value: "all" },
              ...teams.map((t) => ({ label: t.label, value: t.value })),
            ]}
          />
          <FilterSelect
            label={t("schedule.stage")}
            value={stage}
            onChange={(v) => setStage(v as StageFilter)}
            options={[
              { label: t("schedule.allStages"), value: "all" },
              { label: `${t("schedule.group")} stage`, value: "group" },
            ]}
          />
        </div>
        <label className="text-ink-300 mt-3 flex cursor-pointer items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={hideConflicts}
            onChange={(e) => setHideConflicts(e.target.checked)}
            className="h-4 w-4 rounded border-ink-700 bg-ink-950 text-pitch-500 focus:ring-pitch-500"
          />
          <span>{t("schedule.noConflictsOnly")}</span>
          {conflictByMatchId.size > 0 && (
            <span className="text-ink-500">
              ({conflictByMatchId.size} {conflictByMatchId.size === 1 ? "match" : "matches"})
            </span>
          )}
        </label>
        {hasActiveFilter && (
          <div className="mt-3 flex items-center justify-between text-xs text-ink-400">
            <span>{t("schedule.showing", { n: filtered.length, total: matches.length })}</span>
            <button
              type="button"
              onClick={resetFilters}
              className="hover:text-pitch-300 rounded-md px-2 py-1 text-pitch-400 hover:bg-ink-800"
            >
              {t("schedule.reset")}
            </button>
          </div>
        )}
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-10 text-center text-sm text-ink-400">
          {t("schedule.noMatches")}
          <button
            type="button"
            onClick={resetFilters}
            className="ml-2 underline-offset-2 hover:underline"
          >
            {t("schedule.reset")}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ day, matches: ms }) => (
            <div key={day}>
              <h2 className="text-ink-300 sticky top-14 z-10 -mx-4 mb-3 bg-ink-950/85 px-4 py-2 text-sm font-semibold uppercase tracking-wider backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <span suppressHydrationWarning>{formatLocalDate(`${day}T12:00:00Z`, tz)}</span>
                <span className="ml-2 text-ink-500">·</span>
                <span className="ml-2 text-ink-500">
                  {ms.length} match{ms.length === 1 ? "" : "es"}
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ms.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    tz={tz}
                    live={liveByMatchId.get(m.id)}
                    conflict={conflictByMatchId.get(m.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-400">{label}</span>
      <select className="select w-full" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
