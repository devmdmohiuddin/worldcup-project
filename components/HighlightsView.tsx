"use client";

import { useEffect, useMemo, useState } from "react";
import type { Highlight } from "@/lib/types";
import { HighlightCard } from "./HighlightCard";

interface Props {
  initialHighlights: Highlight[];
  bestGoals: Highlight[];
  /** All known team names — drives the team filter dropdown. */
  teamOptions: string[];
}

type KindFilter = "all" | "match" | "best-goals";

export function HighlightsView({ initialHighlights, bestGoals, teamOptions }: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [kind, setKind] = useState<KindFilter>("all");
  const [team, setTeam] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  // Refresh client-side every 5 minutes so new post-match clips appear
  // without a page reload — cheap because the API caches.
  useEffect(() => {
    const tick = async () => {
      try {
        const res = await fetch("/api/highlights", { cache: "no-store" });
        const data = (await res.json()) as { highlights?: Highlight[] };
        if (Array.isArray(data.highlights)) setHighlights(data.highlights);
      } catch {
        /* ignore */
      }
    };
    const handle = setInterval(tick, 5 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  const filtered = useMemo(() => {
    return highlights.filter((h) => {
      if (kind === "match" && h.kind !== "match") return false;
      if (kind === "best-goals" && h.kind !== "best-goals") return false;
      if (team && !h.tags.some((t) => t.toLowerCase() === team.toLowerCase())) return false;
      if (date && !h.publishedAt.startsWith(date)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !h.title.toLowerCase().includes(q) &&
          !h.channelName.toLowerCase().includes(q) &&
          !h.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [highlights, kind, team, date, query]);

  const empty = filtered.length === 0;

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400">
              Type
            </label>
            <select
              className="select w-full"
              value={kind}
              onChange={(e) => setKind(e.target.value as KindFilter)}
            >
              <option value="all">All highlights</option>
              <option value="match">Match highlights</option>
              <option value="best-goals">Best goals</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400">
              Team
            </label>
            <select
              className="select w-full"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            >
              <option value="">Any team</option>
              {teamOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400">
              Date
            </label>
            <input
              type="date"
              className="select w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400">
              Search
            </label>
            <input
              type="search"
              placeholder="player, channel, keyword…"
              className="select w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        {(kind !== "all" || team || date || query) && (
          <button
            type="button"
            onClick={() => {
              setKind("all");
              setTeam("");
              setDate("");
              setQuery("");
            }}
            className="text-xs uppercase tracking-wider text-ink-400 hover:text-pitch-400"
          >
            Reset filters
          </button>
        )}
      </section>

      {kind === "all" && bestGoals.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-200">
            <span className="inline-block h-2 w-2 rounded-full bg-pitch-500" aria-hidden />
            Best goals of the tournament
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bestGoals.map((h) => (
              <HighlightCard key={h.videoId} highlight={h} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-200">
          <span className="inline-block h-2 w-2 rounded-full bg-ink-500" aria-hidden />
          {kind === "best-goals" ? "Best goals" : "Match highlights"}
        </h2>
        {empty ? (
          <div className="rounded-xl border border-dashed border-ink-800 bg-ink-900/40 p-8 text-center text-sm text-ink-400">
            {highlights.length === 0
              ? "No highlights yet — they'll appear here right after each match ends."
              : "No videos match your filters."}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered
              .filter((h) => kind !== "all" || h.kind !== "best-goals")
              .map((h) => (
                <HighlightCard key={h.videoId} highlight={h} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
