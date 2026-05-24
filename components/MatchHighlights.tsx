"use client";

import { useEffect, useState } from "react";
import type { Highlight } from "@/lib/types";
import { HighlightCard } from "./HighlightCard";

interface Props {
  matchId: string;
  /** True once the match has ended — we don't fetch before then. */
  isFinished: boolean;
}

/**
 * Highlights block on the match page. Stays hidden until full time, then
 * polls /api/highlights/match/:id once and renders the official clips. We
 * don't poll on a tight interval — broadcasters upload once.
 */
export function MatchHighlights({ matchId, isFinished }: Props) {
  const [highlights, setHighlights] = useState<Highlight[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isFinished) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/highlights/match/${matchId}`, { cache: "no-store" })
      .then((r) => r.json() as Promise<{ highlights?: Highlight[] }>)
      .then((d) => {
        if (cancelled) return;
        setHighlights(Array.isArray(d.highlights) ? d.highlights : []);
      })
      .catch(() => {
        if (!cancelled) setHighlights([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [matchId, isFinished]);

  if (!isFinished) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/60">
      <header className="border-b border-ink-800 px-5 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-200">
          Highlights
        </h2>
        <p className="mt-0.5 text-xs text-ink-500">
          Official video from licensed broadcasters.
        </p>
      </header>
      <div className="px-5 py-4">
        {loading && highlights === null && (
          <div className="text-sm text-ink-400">Loading highlights…</div>
        )}
        {highlights !== null && highlights.length === 0 && (
          <div className="text-sm text-ink-400">
            No official highlights uploaded yet — broadcasters typically post
            within an hour of full time.
          </div>
        )}
        {highlights && highlights.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((h) => (
              <HighlightCard key={h.videoId} highlight={h} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
