"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/hooks/useLocale";

export function LanguageSelect() {
  const { locale, setLocale } = useLocale();

  return (
    <label className="flex items-center gap-1 text-xs text-ink-400" title="Language">
      <span aria-hidden>🌐</span>
      <select
        aria-label="Language"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="rounded-md border border-ink-700 bg-ink-900 px-2 py-1 text-sm text-ink-100 focus:border-pitch-500 focus:outline-none"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
