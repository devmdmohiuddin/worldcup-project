/**
 * Prayer-time helpers built around the Aladhan public API.
 *
 * Aladhan is free, has no auth requirement, and serves accurate timings for any
 * lat/lng or city. We hit the "timings" endpoint and normalize the response into
 * a stable shape so the rest of the app never sees provider quirks.
 *
 * Docs: https://aladhan.com/prayer-times-api
 */

import { getCache } from "./cache";

export type PrayerName = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export const FIVE_DAILY_PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export interface PrayerTimes {
  /** YYYY-MM-DD in the venue's local time. */
  date: string;
  /** IANA timezone the timings are computed for. */
  timezone: string;
  /** HH:mm 24h strings, keyed by canonical prayer name. */
  timings: Record<PrayerName, string>;
}

export interface PrayerConflict {
  prayer: PrayerName;
  /** HH:mm local time of the prayer that overlaps. */
  prayerTime: string;
  /** Minutes from kickoff to the prayer entering (negative = before, positive = after). */
  offsetMinutes: number;
}

interface AladhanTimingsResponse {
  data?: {
    timings?: Record<string, string>;
    meta?: { timezone?: string };
    date?: { gregorian?: { date?: string } };
  };
}

const ALADHAN_BASE = "https://api.aladhan.com/v1";
/** Default Shafi'i/Hanafi-friendly method (Muslim World League). */
const DEFAULT_METHOD = 3;
/** A typical World Cup match runs ~110 minutes including stoppages and half-time. */
export const MATCH_DURATION_MIN = 110;
/** Cache prayer-times responses for a full day — they don't change once published. */
const PRAYER_TTL_SECONDS = 60 * 60 * 24;

/**
 * Fetch the five daily prayer times for a coordinate on a given date.
 * Cached for 24h to stay polite to the Aladhan free tier.
 */
export async function getPrayerTimes(params: {
  latitude: number;
  longitude: number;
  /** YYYY-MM-DD; defaults to today in the venue's tz when omitted. */
  date?: string;
  method?: number;
}): Promise<PrayerTimes | null> {
  const { latitude, longitude, method = DEFAULT_METHOD } = params;
  const date = params.date ?? todayIso();
  const cacheKey = `prayer:${latitude.toFixed(2)}:${longitude.toFixed(2)}:${date}:${method}`;
  const cache = getCache();
  const cached = await cache.get<PrayerTimes>(cacheKey);
  if (cached) return cached;

  const [yyyy, mm, dd] = date.split("-");
  const url = `${ALADHAN_BASE}/timings/${dd}-${mm}-${yyyy}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

  try {
    const res = await fetch(url, { next: { revalidate: PRAYER_TTL_SECONDS } });
    if (!res.ok) return null;
    const json = (await res.json()) as AladhanTimingsResponse;
    const t = json.data?.timings;
    if (!t) return null;
    const normalized: PrayerTimes = {
      date,
      timezone: json.data?.meta?.timezone ?? "UTC",
      timings: {
        Fajr: stripTimezone(t.Fajr),
        Sunrise: stripTimezone(t.Sunrise),
        Dhuhr: stripTimezone(t.Dhuhr),
        Asr: stripTimezone(t.Asr),
        Maghrib: stripTimezone(t.Maghrib),
        Isha: stripTimezone(t.Isha),
      },
    };
    await cache.set(cacheKey, normalized, PRAYER_TTL_SECONDS);
    return normalized;
  } catch {
    return null;
  }
}

/**
 * Detect whether any of the five daily prayers falls inside the match window.
 * Returns the first conflict (earliest prayer); callers usually only need one
 * to show a single badge per fixture.
 */
export function findPrayerConflict(
  kickoffUTC: string,
  prayerTimes: PrayerTimes,
  durationMin: number = MATCH_DURATION_MIN,
): PrayerConflict | null {
  const kickoffMin = utcToVenueMinutes(kickoffUTC, prayerTimes.timezone);
  const endMin = kickoffMin + durationMin;

  for (const prayer of FIVE_DAILY_PRAYERS) {
    const timeStr = prayerTimes.timings[prayer];
    if (!timeStr) continue;
    const prayerMin = hhmmToMinutes(timeStr);
    if (prayerMin >= kickoffMin && prayerMin <= endMin) {
      return {
        prayer,
        prayerTime: timeStr,
        offsetMinutes: prayerMin - kickoffMin,
      };
    }
  }
  return null;
}

/** Helpers — exported for use in tests and the i18n labels. */
export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToHhmm(min: number): string {
  const h = Math.floor((((min % 1440) + 1440) % 1440) / 60);
  const m = ((min % 60) + 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Aladhan returns "18:45 (PKT)" — strip the trailing tz label. */
function stripTimezone(raw: string | undefined): string {
  if (!raw) return "";
  return raw.replace(/\s*\(.*\)$/, "").trim();
}

function todayIso(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

/**
 * Convert a UTC ISO instant to "minutes since local midnight" in the given
 * IANA timezone. Used so we can compare against HH:mm prayer strings without
 * touching Date arithmetic across tz boundaries.
 */
function utcToVenueMinutes(iso: string, tz: string): number {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const lookup: Record<string, string> = {};
  for (const p of parts) lookup[p.type] = p.value;
  const h = Number(lookup.hour);
  const m = Number(lookup.minute);
  return (h === 24 ? 0 : h) * 60 + m;
}
