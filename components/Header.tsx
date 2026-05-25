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
        <Link href="/" className="flex items-center gap-2" aria-label="MatchHub home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon.svg"
            alt=""
            aria-hidden
            width={28}
            height={28}
            className="h-7 w-7 rounded-md"
          />
          <span className="text-base font-semibold tracking-tight">
            Match<span className="text-pitch-400">Hub</span>
            <span className="ml-0.5 text-xs font-medium text-orange-400">.live</span>
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
