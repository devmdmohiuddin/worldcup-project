"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LOCALE_CHANGE_EVENT,
  type Locale,
  type TranslationKey,
  getLocaleDir,
  readLocaleCookie,
  translate,
  writeLocaleCookie,
} from "@/lib/i18n";

/**
 * Hook that exposes the current locale and a translation function. Hydrates
 * from the cookie on mount and re-renders whenever the user switches language
 * via the LanguageSelect component (which fires LOCALE_CHANGE_EVENT).
 *
 * Stays "en" on the server and during initial hydration to keep React happy;
 * the browser swaps to the real locale on first effect.
 */
export function useLocale() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored = readLocaleCookie();
    if (stored) {
      setLocale(stored);
      document.documentElement.lang = stored;
      document.documentElement.dir = getLocaleDir(stored);
    }
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Locale>).detail;
      if (detail) setLocale(detail);
    };
    window.addEventListener(LOCALE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, handler);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale],
  );

  const change = useCallback((next: Locale) => {
    writeLocaleCookie(next);
    setLocale(next);
  }, []);

  return { locale, t, setLocale: change, dir: getLocaleDir(locale) };
}
