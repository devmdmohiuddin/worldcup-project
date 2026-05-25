"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLiveData } from "@/lib/hooks/useLiveData";
import { getGroupStageMatches } from "@/lib/fixtures";
import { resolveSlot } from "@/lib/teams";
import type { LiveMatch } from "@/lib/types";
import { LiveBadge } from "./LiveBadge";

interface ApiResponse {
  matches: LiveMatch[];
}

export function LiveTicker() {
  const { data } = useLiveData<ApiResponse>({ url: "/api/live", intervalMs: 30_000 });
  const fixtures = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getGroupStageMatches>[number]>();
    for (const m of getGroupStageMatches()) map.set(m.id, m);
    return map;
  }, []);

  const live = (data?.matches ?? []).filter((m) => m.status === "live" || m.status === "half-time");

  if (live.length === 0) return null;

  return (
    <div className="border-b border-ink-800 bg-ink-900/40">
      <div className="container-page flex items-center gap-3 overflow-x-auto py-2 text-sm">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-red-700">
          Live now
        </span>
        <div className="flex items-center gap-2">
          {live.map((m) => {
            const fixture = fixtures.get(m.matchId);
            if (!fixture) return null;
            const home = resolveSlot(fixture.homeSlot);
            const away = resolveSlot(fixture.awaySlot);
            return (
              <Link
                key={m.matchId}
                href={`/match/${m.matchId}`}
                className="flex shrink-0 items-center gap-2 rounded-md border border-ink-800 bg-ink-950 px-3 py-1.5 hover:border-pitch-600/60"
              >
                <LiveBadge status={m.status} minute={m.minute} />
                <span className="font-medium text-ink-100">{home}</span>
                <span className="font-mono text-sm tabular-nums text-ink-100">
                  {m.homeScore ?? 0}–{m.awayScore ?? 0}
                </span>
                <span className="font-medium text-ink-100">{away}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
