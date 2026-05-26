"use client";

import { useEffect, useMemo, useRef } from "react";
import type { GroupLetter, GroupStanding } from "@/lib/types";
import { useLiveData } from "@/lib/hooks/useLiveData";
import { teamCountryCode } from "@/lib/teams";
import { TeamFlag } from "./TeamFlag";
import { StandingsSkeleton } from "./Skeleton";

interface Props {
  /** Group letter to highlight at the top of the dialog; null = no focus. */
  focusedGroup: GroupLetter | null;
  onClose: () => void;
}

interface ApiResponse {
  standings: GroupStanding[];
}

const ALL_GROUPS: GroupLetter[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

// Mount only while open — keeps the standings poll dormant when the dialog
// isn't visible.
export function GroupsModal({ focusedGroup, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { data, loading } = useLiveData<ApiResponse>({
    url: "/api/standings",
    intervalMs: 60_000,
  });

  // Close on Esc + lock body scroll while mounted.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const ordered = useMemo<GroupLetter[]>(() => {
    if (!focusedGroup) return ALL_GROUPS;
    return [focusedGroup, ...ALL_GROUPS.filter((g) => g !== focusedGroup)];
  }, [focusedGroup]);

  const byLetter = useMemo(() => {
    const m = new Map<GroupLetter, GroupStanding>();
    for (const g of data?.standings ?? []) m.set(g.group, g);
    return m;
  }, [data]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="groups-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <button
        type="button"
        aria-label="Close groups dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink-50/40 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        className="relative z-10 flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-ink-700 bg-ink-950 shadow-2xl sm:h-[85vh] sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-ink-700 bg-ink-900 px-5 py-4">
          <div>
            <h2
              id="groups-modal-title"
              className="text-base font-bold tracking-tight text-ink-100 sm:text-lg"
            >
              World Cup 2026 — Groups
            </h2>
            <p className="mt-0.5 text-xs text-ink-500">
              {focusedGroup
                ? `Showing Group ${focusedGroup} first`
                : "All twelve groups"}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-400 hover:bg-ink-800 hover:text-ink-100 focus:outline-none focus:ring-2 focus:ring-pitch-500"
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M5.3 4.3a1 1 0 0 1 1.4 0L10 7.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 9l3.3 3.3a1 1 0 1 1-1.4 1.4L10 10.4l-3.3 3.3a1 1 0 1 1-1.4-1.4L8.6 9 5.3 5.7a1 1 0 0 1 0-1.4z" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {loading && !data ? (
            <StandingsSkeleton />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {ordered.map((letter) => {
                const standing = byLetter.get(letter);
                const isFocused = letter === focusedGroup;
                return (
                  <GroupCard
                    key={letter}
                    letter={letter}
                    standing={standing}
                    focused={isFocused}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupCard({
  letter,
  standing,
  focused,
}: {
  letter: GroupLetter;
  standing: GroupStanding | undefined;
  focused: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-ink-900 ${
        focused
          ? "border-pitch-500 shadow-md ring-1 ring-pitch-500/30 sm:col-span-2"
          : "border-ink-700"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-4 ${
          focused
            ? "border-pitch-500/30 bg-pitch-600 py-3 text-white"
            : "border-ink-700 bg-ink-950 py-2 text-ink-200"
        }`}
      >
        <span
          className={
            focused
              ? "text-base font-bold uppercase tracking-wider"
              : "text-sm font-bold uppercase tracking-wider"
          }
        >
          Group {letter}
        </span>
        {focused && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
            Selected
          </span>
        )}
      </div>

      {standing ? (
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-wider text-ink-500">
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
            {standing.rows.map((r, idx) => {
              const placeholder = r.team.startsWith("TBD") || r.team === r.slot;
              const cc = placeholder ? null : teamCountryCode(r.team);
              return (
                <tr key={r.slot} className={idx < 2 ? "bg-pitch-50/60" : ""}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-[10px] tabular-nums text-ink-500">
                        {idx + 1}
                      </span>
                      <TeamFlag cc={cc} size="sm" />
                      <span
                        className={
                          placeholder ? "text-ink-400" : "font-medium text-ink-100"
                        }
                      >
                        {placeholder ? r.slot : r.team}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">{r.played}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{r.won}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{r.drawn}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{r.lost}</td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {r.goalDifference > 0
                      ? `+${r.goalDifference}`
                      : r.goalDifference}
                  </td>
                  <td className="px-2 py-2 text-right font-bold tabular-nums">
                    {r.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="px-4 py-6 text-center text-sm text-ink-400">
          Standings unavailable.
        </div>
      )}
    </div>
  );
}
