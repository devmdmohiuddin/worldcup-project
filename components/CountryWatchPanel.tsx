"use client";

import { useEffect, useMemo, useState } from "react";
import type { Broadcaster, CountryBroadcasters } from "@/lib/types";
import {
  getBroadcastersForCountry,
  getFallbackBroadcasters,
  resolveBroadcasterUrl,
  sortBroadcasters,
} from "@/lib/broadcasters";
import { COUNTRY_CHANGE_EVENT, readCountryCookie } from "@/lib/country";

/**
 * Generic (not match-specific) "Where to watch in your country" panel for
 * the home page. Splits broadcasters into Local TV vs Streaming, with a free
 * vs paid tag on each card. Reacts to country-change events from the header
 * dropdown so picking a country in either place updates everything.
 */
export function CountryWatchPanel() {
  const [code, setCode] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const cookie = readCountryCookie();
    if (cookie) {
      setCode(cookie.toUpperCase());
      setResolved(true);
      return;
    }
    fetch("/api/country")
      .then((r) => r.json())
      .then((d: { code: string | null }) => setCode(d.code ? d.code.toUpperCase() : null))
      .catch(() => {})
      .finally(() => setResolved(true));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setCode(detail.toUpperCase());
    };
    window.addEventListener(COUNTRY_CHANGE_EVENT, handler);
    return () => window.removeEventListener(COUNTRY_CHANGE_EVENT, handler);
  }, []);

  const country = useMemo<CountryBroadcasters | null>(
    () => getBroadcastersForCountry(code),
    [code],
  );
  const broadcasters = useMemo(
    () => sortBroadcasters(country?.broadcasters ?? getFallbackBroadcasters()),
    [country],
  );

  const tv = broadcasters.filter((b) => b.type === "tv");
  const streaming = broadcasters.filter((b) => b.type === "streaming" || b.type === "radio");

  return (
    <section className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 shadow-sm">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-700 px-5 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-200">
          Where to watch in your country
        </h2>
        <p className="text-xs text-ink-500">
          {country ? (
            <>
              Showing options for{" "}
              <span className="font-medium text-ink-300">
                {country.flag} {country.name}
              </span>
            </>
          ) : resolved ? (
            "No listings for your country yet — showing global options."
          ) : (
            "Detecting your country…"
          )}
        </p>
      </header>

      <div className="grid gap-5 px-5 py-4 sm:grid-cols-2">
        <Column
          title="Local TV"
          tone="tv"
          items={tv}
          emptyMsg="No local TV listings yet."
        />
        <Column
          title="Streaming"
          tone="stream"
          items={streaming}
          emptyMsg="No streaming listings yet."
        />
      </div>

      <footer className="border-t border-ink-700 px-5 py-3 text-xs text-ink-500">
        Listings curated for clean viewing — no betting partners. Some links may be affiliate links
        that help fund the site at no cost to you.
      </footer>
    </section>
  );
}

type Tone = "tv" | "stream";

// Tailwind JIT only picks up classes it can find literally in source, so each
// tone keeps its full class strings rather than templating them in.
const TONE = {
  tv: {
    dot: "bg-sky-500",
    accent: "text-sky-700",
    hoverBorder: "hover:border-sky-400",
    hoverAccent: "group-hover:text-sky-700",
    chip: "bg-sky-50 text-sky-700 border border-sky-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm4 11h6v2H7z" />
      </svg>
    ),
    label: "TV",
  },
  stream: {
    dot: "bg-violet-500",
    accent: "text-violet-700",
    hoverBorder: "hover:border-violet-400",
    hoverAccent: "group-hover:text-violet-700",
    chip: "bg-violet-50 text-violet-700 border border-violet-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M10 2a7 7 0 0 0-7 7v6a2 2 0 0 0 2 2h2v-7H5v-1a5 5 0 1 1 10 0v1h-2v7h2a2 2 0 0 0 2-2V9a7 7 0 0 0-7-7z" />
      </svg>
    ),
    label: "Stream",
  },
} as const;

function Column({
  title,
  tone,
  items,
  emptyMsg,
}: {
  title: string;
  tone: Tone;
  items: Broadcaster[];
  emptyMsg: string;
}) {
  const t = TONE[tone];
  return (
    <div>
      <h3
        className={`mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${t.accent}`}
      >
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${t.dot}`} aria-hidden />
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-xs text-ink-500">{emptyMsg}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((b) => (
            <BroadcasterRow key={`${b.name}-${b.type}`} broadcaster={b} tone={tone} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BroadcasterRow({ broadcaster, tone }: { broadcaster: Broadcaster; tone: Tone }) {
  const url = resolveBroadcasterUrl(broadcaster);
  const t = TONE[tone];
  const tierTone =
    broadcaster.tier === "free"
      ? "bg-pitch-50 text-pitch-700 border border-pitch-600/30"
      : "bg-amber-50 text-amber-700 border border-amber-300";
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`group flex items-center justify-between gap-3 rounded-xl border border-ink-700 bg-ink-950 px-3 py-2.5 transition-colors ${t.hoverBorder}`}
      >
        <div className={`shrink-0 ${t.accent}`} aria-hidden>
          {t.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className={`truncate text-sm font-medium text-ink-100 ${t.hoverAccent}`}>
            {broadcaster.name}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-500">
            <span className={`rounded px-1.5 py-0.5 font-semibold ${t.chip}`}>{t.label}</span>
            <span className={`rounded px-1.5 py-0.5 font-semibold ${tierTone}`}>{broadcaster.tier}</span>
            {broadcaster.languages.slice(0, 2).map((l) => (
              <span key={l} className="rounded bg-ink-800 px-1.5 py-0.5">
                {l}
              </span>
            ))}
          </div>
          {broadcaster.note && (
            <p className="mt-1 truncate text-xs text-ink-400">{broadcaster.note}</p>
          )}
        </div>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-ink-400 ${t.hoverAccent}`}
          fill="currentColor"
        >
          <path d="M11 3a1 1 0 1 0 0 2h2.59l-7.3 7.29a1 1 0 1 0 1.42 1.42L15 6.41V9a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1z" />
          <path d="M5 5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H5V7h3a1 1 0 0 0 0-2z" />
        </svg>
      </a>
    </li>
  );
}
