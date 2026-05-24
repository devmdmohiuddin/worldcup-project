"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";
import { findPrayerConflict, type PrayerConflict, type PrayerTimes } from "@/lib/prayer";
import { usePrayerTimes } from "./usePrayerTimes";

/**
 * For each match in the list, compute whether one of the user's five daily
 * prayers falls inside the match window. We fetch prayer times once per date
 * the user actually has matches on — most days only one fetch hits Aladhan.
 */
export function useMatchConflicts(matches: Match[]): Map<string, PrayerConflict> {
  const { coords, method } = usePrayerTimes();
  const [conflicts, setConflicts] = useState<Map<string, PrayerConflict>>(new Map());

  useEffect(() => {
    if (!coords) {
      setConflicts(new Map());
      return;
    }
    let aborted = false;

    const dates = new Set<string>();
    for (const m of matches) dates.add(m.kickoffUTC.slice(0, 10));

    Promise.all(
      Array.from(dates).map((date) =>
        fetch(
          `/api/prayer?lat=${coords.latitude}&lng=${coords.longitude}&date=${date}&method=${method}`,
        )
          .then((r) => (r.ok ? (r.json() as Promise<PrayerTimes>) : null))
          .then((data) => [date, data] as const)
          .catch(() => [date, null] as const),
      ),
    ).then((entries) => {
      if (aborted) return;
      const byDate = new Map<string, PrayerTimes>();
      for (const [date, data] of entries) {
        if (data) byDate.set(date, data);
      }
      const next = new Map<string, PrayerConflict>();
      for (const m of matches) {
        const pt = byDate.get(m.kickoffUTC.slice(0, 10));
        if (!pt) continue;
        const conflict = findPrayerConflict(m.kickoffUTC, pt);
        if (conflict) next.set(m.id, conflict);
      }
      setConflicts(next);
    });

    return () => {
      aborted = true;
    };
  }, [matches, coords, method]);

  return conflicts;
}
