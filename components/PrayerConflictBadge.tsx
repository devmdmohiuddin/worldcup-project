"use client";

import type { PrayerConflict, PrayerName } from "@/lib/prayer";
import { useLocale } from "@/lib/hooks/useLocale";
import type { TranslationKey } from "@/lib/i18n";

const LABEL_KEYS: Record<PrayerName, TranslationKey> = {
  Fajr: "prayer.fajr",
  Sunrise: "prayer.sunrise",
  Dhuhr: "prayer.dhuhr",
  Asr: "prayer.asr",
  Maghrib: "prayer.maghrib",
  Isha: "prayer.isha",
};

interface Props {
  conflict: PrayerConflict;
  className?: string;
}

export function PrayerConflictBadge({ conflict, className = "" }: Props) {
  const { t } = useLocale();
  const label = t(LABEL_KEYS[conflict.prayer]);
  const title = `${t("prayer.conflict", { prayer: label, time: conflict.prayerTime })} — ${t("prayer.duringMatch")}`;
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 ${className}`}
    >
      <span aria-hidden>⚠️</span>
      <span>
        {label} {conflict.prayerTime}
      </span>
    </span>
  );
}
