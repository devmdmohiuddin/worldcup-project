"use client";

import { useEffect, useMemo, useState } from "react";
import { FIVE_DAILY_PRAYERS, hhmmToMinutes, type PrayerName } from "@/lib/prayer";
import { usePrayerTimes } from "@/lib/hooks/usePrayerTimes";
import { useLocale } from "@/lib/hooks/useLocale";
import type { TranslationKey } from "@/lib/i18n";

const METHODS = [
  { value: 2, label: "ISNA (North America)" },
  { value: 3, label: "Muslim World League" },
  { value: 4, label: "Umm al-Qura (Makkah)" },
  { value: 1, label: "Karachi (Hanafi-friendly)" },
  { value: 5, label: "Egyptian General Authority" },
];

const PRAYER_LABEL_KEYS: Record<PrayerName, TranslationKey> = {
  Fajr: "prayer.fajr",
  Sunrise: "prayer.sunrise",
  Dhuhr: "prayer.dhuhr",
  Asr: "prayer.asr",
  Maghrib: "prayer.maghrib",
  Isha: "prayer.isha",
};

export function PrayerTimesWidget() {
  const { t } = useLocale();
  const { coords, times, loading, error, denied, requestLocation, method, setMethod } =
    usePrayerTimes();
  const [nowMin, setNowMin] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      const d = new Date();
      setNowMin(d.getHours() * 60 + d.getMinutes());
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const nextPrayer = useMemo<PrayerName | null>(() => {
    if (!times || nowMin == null) return null;
    let candidate: PrayerName | null = null;
    let minDelta = Infinity;
    for (const p of FIVE_DAILY_PRAYERS) {
      const tm = times.timings[p];
      if (!tm) continue;
      const delta = hhmmToMinutes(tm) - nowMin;
      if (delta >= 0 && delta < minDelta) {
        minDelta = delta;
        candidate = p;
      }
    }
    return candidate ?? "Fajr";
  }, [times, nowMin]);

  return (
    <section className="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-200">
          <span aria-hidden>🕌</span> {t("prayer.widgetTitle")}
        </h2>
        {coords && (
          <span className="text-xs tabular-nums text-ink-500">
            {coords.latitude.toFixed(2)}°, {coords.longitude.toFixed(2)}°
          </span>
        )}
      </div>

      {!coords && !denied && (
        <button
          type="button"
          onClick={requestLocation}
          className="text-pitch-300 rounded-md border border-pitch-600/60 bg-pitch-600/10 px-3 py-2 text-sm hover:bg-pitch-600/20"
        >
          {t("prayer.enableLocation")}
        </button>
      )}

      {denied && !coords && <p className="text-xs text-ink-400">{t("prayer.denied")}</p>}

      {loading && <p className="text-xs text-ink-400">{t("common.loading")}</p>}
      {error && !times && <p className="text-xs text-rose-400">{error}</p>}

      {times && (
        <>
          <ul className="grid grid-cols-5 gap-2 text-center">
            {FIVE_DAILY_PRAYERS.map((p) => {
              const tm = times.timings[p];
              const isNext = p === nextPrayer;
              return (
                <li
                  key={p}
                  className={`rounded-lg border px-2 py-2 ${
                    isNext
                      ? "text-pitch-200 border-pitch-500 bg-pitch-500/10"
                      : "text-ink-300 border-ink-800 bg-ink-950/40"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider opacity-80">
                    {t(PRAYER_LABEL_KEYS[p])}
                  </div>
                  <div className="mt-1 font-mono text-sm font-semibold tabular-nums">{tm}</div>
                  {isNext && (
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-pitch-400">
                      {t("prayer.next")}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex flex-col gap-1 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {times.timezone} · {times.date}
            </span>
            <label className="flex items-center gap-1">
              <span className="text-ink-500">{t("prayer.method")}:</span>
              <select
                value={method}
                onChange={(e) => setMethod(Number(e.target.value))}
                className="rounded border border-ink-800 bg-ink-950 px-1 py-0.5 text-ink-200"
              >
                {METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
    </section>
  );
}
