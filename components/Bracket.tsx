"use client";

import { useMemo } from "react";
import { useLiveData } from "@/lib/hooks/useLiveData";
import { buildBracket } from "@/lib/bracket";
import type { BracketMatch, GroupStanding } from "@/lib/types";

interface ApiResponse {
  standings: GroupStanding[];
}

const ROUND_ORDER = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Third-place play-off",
  "Final",
];

export function Bracket() {
  const { data } = useLiveData<ApiResponse>({ url: "/api/standings", intervalMs: 60_000 });

  const matches = useMemo(() => buildBracket(data?.standings ?? []), [data]);
  const byRound = useMemo(() => {
    const m = new Map<string, BracketMatch[]>();
    for (const r of ROUND_ORDER) m.set(r, []);
    for (const match of matches) m.get(match.round)?.push(match);
    return m;
  }, [matches]);

  return (
    <div className="space-y-8">
      {ROUND_ORDER.map((round) => {
        const list = byRound.get(round) ?? [];
        return (
          <section key={round}>
            <h2 className="text-ink-300 mb-3 text-sm font-semibold uppercase tracking-wider">
              {round}
              <span className="ml-2 text-ink-500">
                · {list.length} match{list.length === 1 ? "" : "es"}
              </span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((m) => (
                <article
                  key={m.id}
                  className="rounded-xl border border-ink-800 bg-ink-900/40 p-3 text-sm"
                >
                  <Slot label={m.home.label} resolved={m.home.resolved} />
                  <div className="my-1 text-center text-xs text-ink-500">vs</div>
                  <Slot label={m.away.label} resolved={m.away.resolved} />
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Slot({ label, resolved }: { label: string; resolved: boolean }) {
  return (
    <div
      className={`truncate rounded-md border px-2 py-1.5 ${
        resolved
          ? "border-ink-700 bg-ink-900 text-ink-100"
          : "border-dashed border-ink-700 bg-ink-900/40 text-ink-400"
      }`}
      title={label}
    >
      {label}
    </div>
  );
}
