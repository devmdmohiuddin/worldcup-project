/**
 * Format a UTC ISO timestamp into the viewer's local timezone.
 * Pure browser-side helper — uses Intl.DateTimeFormat.
 */
export function formatLocalDate(iso: string, tz?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  }).format(new Date(iso));
}

export function formatLocalTime(iso: string, tz?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  }).format(new Date(iso));
}

export function formatLocalDateTime(iso: string, tz?: string): string {
  return `${formatLocalDate(iso, tz)} · ${formatLocalTime(iso, tz)}`;
}

/** YYYY-MM-DD in the user's local timezone, used as a stable grouping key. */
export function localDayKey(iso: string, tz?: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: tz,
  }).formatToParts(new Date(iso));
  const lookup: Record<string, string> = {};
  for (const p of parts) lookup[p.type] = p.value;
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

export function detectUserTimezone(): string {
  if (typeof Intl !== "undefined") {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }
  return "UTC";
}
