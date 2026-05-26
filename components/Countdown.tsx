"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** ISO 8601 UTC instant the countdown targets. */
  targetUTC: string;
  /** Optional kicker (e.g. "Opening match · Estadio Azteca, Mexico City"). */
  subtitle?: string;
}

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diff(targetMs: number): Parts {
  const ms = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1_000),
    done: ms === 0,
  };
}

export function Countdown({ targetUTC, subtitle }: Props) {
  const targetMs = new Date(targetUTC).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(diff(targetMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  // Render nothing on SSR / before mount, and auto-remove once kickoff lands.
  if (!parts || parts.done) return null;

  return (
    <section aria-label="Countdown to first match" className="container-page mt-6">
      <div className="relative overflow-hidden rounded-2xl border border-ink-700 bg-gradient-to-br from-pitch-600 via-pitch-700 to-emerald-800 p-6 text-white shadow-sm sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl"
        />

        <TrophyArt className="pointer-events-none absolute -right-4 top-1/2 hidden h-48 w-48 -translate-y-1/2 drop-shadow-[0_8px_30px_rgba(252,211,77,0.35)] sm:block lg:right-8 lg:h-56 lg:w-56" />

        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center sm:pr-44 lg:pr-52">
          <div className="min-w-0 max-w-md">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pitch-50/90">
              <TrophyArt className="h-5 w-5 sm:hidden" />
              FIFA World Cup 2026
            </p>
            <h2
              className="mt-1 text-xl font-bold tracking-tight sm:text-2xl"
              suppressHydrationWarning
            >
              Kicks off in {parts.days} {parts.days === 1 ? "day" : "days"}
            </h2>
            {subtitle && (
              <p
                className="mt-2 text-sm font-medium text-pitch-50/90"
                suppressHydrationWarning
              >
                {subtitle}
              </p>
            )}
          </div>

          <div
            className="grid w-full max-w-sm shrink-0 grid-cols-4 gap-2 sm:w-auto sm:gap-3"
            role="timer"
            aria-live="polite"
            suppressHydrationWarning
          >
            <Unit value={parts.days} label="Days" />
            <Unit value={parts.hours} label="Hours" />
            <Unit value={parts.minutes} label="Min" />
            <Unit value={parts.seconds} label="Sec" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the trophy graphic. Prefers `/trophy.png` (drop your own asset there
 * to swap), falls back to the in-repo `/trophy.svg` if the PNG isn't present.
 */
function TrophyArt({ className }: { className?: string }) {
  const [src, setSrc] = useState<string>("/trophy.png");
  const triedFallback = useRef(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      className={className}
      onError={() => {
        if (triedFallback.current) return;
        triedFallback.current = true;
        setSrc("/trophy.svg");
      }}
    />
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur sm:px-4">
      <div className="font-mono text-2xl font-bold tabular-nums sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-pitch-50/80 sm:text-xs">
        {label}
      </div>
    </div>
  );
}
