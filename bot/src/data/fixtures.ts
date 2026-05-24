import type { GroupLetter, Match } from "./types.js";
import { VENUES, type VenueKey } from "./venues.js";

/**
 * Mirror of the web app's group-stage spec (see ../../lib/fixtures.ts).
 * Kept in sync manually — if you update one, update the other.
 */
const SPEC: ReadonlyArray<
  readonly [GroupLetter, 1 | 2 | 3 | 4 | 5 | 6, string, string, VenueKey]
> = [
  ["A", 1, "2026-06-11", "12:00", "mexico_city"],
  ["B", 1, "2026-06-12", "15:00", "toronto"],
  ["A", 2, "2026-06-12", "12:00", "guadalajara"],
  ["D", 1, "2026-06-12", "18:00", "los_angeles"],
  ["C", 1, "2026-06-13", "12:00", "seattle"],
  ["B", 2, "2026-06-13", "15:00", "vancouver"],
  ["D", 2, "2026-06-13", "18:00", "dallas"],
  ["C", 2, "2026-06-13", "21:00", "san_francisco"],
  ["E", 1, "2026-06-14", "12:00", "boston"],
  ["F", 1, "2026-06-14", "15:00", "atlanta"],
  ["G", 1, "2026-06-14", "18:00", "houston"],
  ["H", 1, "2026-06-14", "21:00", "kansas_city"],
  ["E", 2, "2026-06-15", "12:00", "philadelphia"],
  ["F", 2, "2026-06-15", "15:00", "new_york"],
  ["I", 1, "2026-06-15", "18:00", "miami"],
  ["J", 1, "2026-06-15", "21:00", "monterrey"],
  ["G", 2, "2026-06-16", "12:00", "dallas"],
  ["H", 2, "2026-06-16", "15:00", "houston"],
  ["K", 1, "2026-06-16", "18:00", "atlanta"],
  ["L", 1, "2026-06-16", "21:00", "los_angeles"],
  ["I", 2, "2026-06-17", "12:00", "philadelphia"],
  ["J", 2, "2026-06-17", "15:00", "kansas_city"],
  ["K", 2, "2026-06-17", "18:00", "seattle"],
  ["L", 2, "2026-06-17", "21:00", "san_francisco"],
  ["A", 3, "2026-06-18", "12:00", "mexico_city"],
  ["B", 3, "2026-06-18", "15:00", "toronto"],
  ["D", 3, "2026-06-18", "18:00", "new_york"],
  ["C", 3, "2026-06-18", "21:00", "vancouver"],
  ["A", 4, "2026-06-19", "12:00", "guadalajara"],
  ["B", 4, "2026-06-19", "15:00", "boston"],
  ["D", 4, "2026-06-19", "18:00", "miami"],
  ["C", 4, "2026-06-19", "21:00", "seattle"],
  ["E", 3, "2026-06-20", "12:00", "philadelphia"],
  ["F", 3, "2026-06-20", "15:00", "atlanta"],
  ["G", 3, "2026-06-20", "18:00", "houston"],
  ["H", 3, "2026-06-20", "21:00", "kansas_city"],
  ["E", 4, "2026-06-21", "12:00", "boston"],
  ["F", 4, "2026-06-21", "15:00", "new_york"],
  ["I", 3, "2026-06-21", "18:00", "miami"],
  ["J", 3, "2026-06-21", "21:00", "monterrey"],
  ["G", 4, "2026-06-22", "12:00", "dallas"],
  ["H", 4, "2026-06-22", "15:00", "atlanta"],
  ["K", 3, "2026-06-22", "18:00", "philadelphia"],
  ["L", 3, "2026-06-22", "21:00", "los_angeles"],
  ["I", 4, "2026-06-23", "12:00", "houston"],
  ["J", 4, "2026-06-23", "15:00", "guadalajara"],
  ["K", 4, "2026-06-23", "18:00", "san_francisco"],
  ["L", 4, "2026-06-23", "21:00", "vancouver"],
  ["A", 5, "2026-06-24", "12:00", "mexico_city"],
  ["A", 6, "2026-06-24", "12:00", "guadalajara"],
  ["B", 5, "2026-06-24", "16:00", "toronto"],
  ["B", 6, "2026-06-24", "16:00", "vancouver"],
  ["C", 5, "2026-06-25", "12:00", "seattle"],
  ["C", 6, "2026-06-25", "12:00", "san_francisco"],
  ["D", 5, "2026-06-25", "18:00", "los_angeles"],
  ["D", 6, "2026-06-25", "18:00", "dallas"],
  ["E", 5, "2026-06-26", "12:00", "boston"],
  ["E", 6, "2026-06-26", "12:00", "philadelphia"],
  ["F", 5, "2026-06-26", "16:00", "new_york"],
  ["F", 6, "2026-06-26", "16:00", "atlanta"],
  ["G", 5, "2026-06-26", "20:00", "houston"],
  ["G", 6, "2026-06-26", "20:00", "miami"],
  ["H", 5, "2026-06-26", "21:00", "kansas_city"],
  ["H", 6, "2026-06-26", "21:00", "dallas"],
  ["I", 5, "2026-06-27", "12:00", "miami"],
  ["I", 6, "2026-06-27", "12:00", "philadelphia"],
  ["J", 5, "2026-06-27", "16:00", "monterrey"],
  ["J", 6, "2026-06-27", "16:00", "kansas_city"],
  ["K", 5, "2026-06-27", "20:00", "atlanta"],
  ["K", 6, "2026-06-27", "20:00", "seattle"],
  ["L", 5, "2026-06-27", "21:00", "san_francisco"],
  ["L", 6, "2026-06-27", "21:00", "los_angeles"],
];

function slotsFor(group: GroupLetter, n: 1 | 2 | 3 | 4 | 5 | 6): [string, string] {
  switch (n) {
    case 1: return [`${group}1`, `${group}2`];
    case 2: return [`${group}3`, `${group}4`];
    case 3: return [`${group}1`, `${group}3`];
    case 4: return [`${group}2`, `${group}4`];
    case 5: return [`${group}4`, `${group}1`];
    case 6: return [`${group}2`, `${group}3`];
  }
}

function localToUTC(date: string, time: string, tz: string): string {
  const [hh, mm] = time.split(":").map(Number) as [number, number];
  const [y, mo, d] = date.split("-").map(Number) as [number, number, number];
  const asUTC = Date.UTC(y, mo - 1, d, hh, mm, 0);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(new Date(asUTC));
  const lookup: Record<string, string> = {};
  for (const p of parts) lookup[p.type] = p.value;
  const wallAsUTC = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour) === 24 ? 0 : Number(lookup.hour),
    Number(lookup.minute),
    Number(lookup.second),
  );
  const offset = wallAsUTC - asUTC;
  return new Date(asUTC - offset).toISOString();
}

let cached: Match[] | null = null;

export function getGroupStageMatches(): Match[] {
  if (cached) return cached;
  cached = SPEC.map(([group, n, date, time, vk], idx) => {
    const venue = VENUES[vk];
    const [homeSlot, awaySlot] = slotsFor(group, n);
    return {
      id: `m${idx + 1}`,
      matchNumber: idx + 1,
      group,
      kickoffUTC: localToUTC(date, time, venue.tz),
      homeSlot,
      awaySlot,
      venue,
    };
  });
  return cached;
}

export function getMatchesOn(dateISO: string): Match[] {
  return getGroupStageMatches().filter((m) => m.kickoffUTC.slice(0, 10) === dateISO);
}

export function getTodaysMatches(now: Date = new Date()): Match[] {
  return getMatchesOn(now.toISOString().slice(0, 10));
}

export function getLiveWindowMatches(now: Date = new Date(), windowMs = 3 * 60 * 60 * 1000): Match[] {
  const t = now.getTime();
  return getGroupStageMatches().filter((m) => Math.abs(t - new Date(m.kickoffUTC).getTime()) < windowMs);
}
