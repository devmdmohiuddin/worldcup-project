"use client";

import { useLiveData } from "@/lib/hooks/useLiveData";
import type { GroupLetter, GroupStanding } from "@/lib/types";
import { StandingsSkeleton } from "./Skeleton";

interface ApiResponse {
  standings: GroupStanding[];
}

interface Props {
  /** Render only this group's table when set; useful for embedded match-detail view. */
  filterGroup?: GroupLetter;
  /** Hide the group heading bar (used inside contexts that already show the group). */
  hideHeader?: boolean;
}

export function StandingsTable({ filterGroup, hideHeader = false }: Props = {}) {
  const { data, loading } = useLiveData<ApiResponse>({
    url: "/api/standings",
    intervalMs: 60_000,
  });

  if (loading && !data) {
    return <StandingsSkeleton />;
  }

  let standings = data?.standings ?? [];
  if (filterGroup) standings = standings.filter((g) => g.group === filterGroup);
  if (standings.length === 0) {
    return <div className="text-sm text-ink-400">No standings available.</div>;
  }

  const gridClass = filterGroup
    ? ""
    : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {standings.map((g) => (
        <div
          key={g.group}
          id={`group-${g.group}`}
          className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900"
        >
          {!hideHeader && (
            <div className="border-b border-ink-700 bg-ink-950 px-3 py-2 text-sm font-semibold uppercase tracking-wider text-ink-200">
              Group {g.group}
            </div>
          )}
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-3 py-2 text-left">Team</th>
                <th className="px-2 py-2 text-right">P</th>
                <th className="px-2 py-2 text-right">W</th>
                <th className="px-2 py-2 text-right">D</th>
                <th className="px-2 py-2 text-right">L</th>
                <th className="px-2 py-2 text-right">GD</th>
                <th className="px-2 py-2 text-right font-bold">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700">
              {g.rows.map((r, idx) => {
                const placeholder = r.team.startsWith("TBD") || r.team === r.slot;
                return (
                  <tr key={r.slot} className={idx < 2 ? "bg-pitch-600/5" : ""}>
                    <td className="px-3 py-2">
                      <span className="mr-2 text-xs tabular-nums text-ink-500">{idx + 1}</span>
                      <span className={placeholder ? "text-ink-400" : "text-ink-100"}>
                        {placeholder ? r.slot : r.team}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{r.played}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{r.won}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{r.drawn}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{r.lost}</td>
                    <td className="px-2 py-2 text-right tabular-nums">
                      {r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}
                    </td>
                    <td className="px-2 py-2 text-right font-bold tabular-nums">{r.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
