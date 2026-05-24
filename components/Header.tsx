"use client";

import Link from "next/link";
import { CountrySelect } from "./CountrySelect";
import { LanguageSelect } from "./LanguageSelect";
import { useLocale } from "@/lib/hooks/useLocale";

export function Header() {
  const { t } = useLocale();
  return (
    <header
      role="banner"
      className="sticky top-0 z-30 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur"
    >
      <div className="container-page flex h-14 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2" aria-label="FootballClean home">
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-pitch-600 text-base font-bold text-white"
          >
            ⚽
          </span>
          <span className="text-base font-semibold tracking-tight">
            Football<span className="text-pitch-400">Clean</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Primary" className="flex items-center gap-1 text-sm">
            <Link href="/" className="rounded-md px-2 py-1 hover:text-pitch-400">
              {t("nav.schedule")}
            </Link>
            <Link
              href="/standings"
              className="text-ink-300 hidden rounded-md px-2 py-1 hover:text-pitch-400 sm:inline"
            >
              {t("nav.standings")}
            </Link>
            <Link
              href="/bracket"
              className="text-ink-300 hidden rounded-md px-2 py-1 hover:text-pitch-400 sm:inline"
            >
              {t("nav.bracket")}
            </Link>
            <Link
              href="/highlights"
              className="text-ink-300 hidden rounded-md px-2 py-1 hover:text-pitch-400 sm:inline"
            >
              {t("nav.highlights")}
            </Link>
            <Link
              href="/notifications"
              className="text-ink-300 hidden rounded-md px-2 py-1 hover:text-pitch-400 sm:inline"
            >
              {t("nav.notifications")}
            </Link>
          </nav>
          <LanguageSelect />
          <CountrySelect variant="compact" />
        </div>
      </div>
    </header>
  );
}
