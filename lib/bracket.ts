import type { BracketMatch, BracketSlot, GroupStanding } from "./types";

/**
 * Build the 2026 knockout bracket. With 48 teams in 12 groups, the format is:
 *   - Round of 32: top-2 from each group + 8 best third-placed teams
 *   - Round of 16, Quarter-finals, Semi-finals, Third-place, Final
 *
 * Until the group stage is complete the bracket carries placeholder slots
 * ("Winner Group A", "3rd-place X"). Real seeding is wired once standings
 * stabilize — this file gives the UI a complete shape to render against.
 */

function ph(label: string): BracketSlot {
  return { label, resolved: false };
}

function resolveTopTwo(standings: GroupStanding[]): Record<string, BracketSlot> {
  const out: Record<string, BracketSlot> = {};
  for (const g of standings) {
    const finished = g.rows.every((r) => r.played === 3);
    out[`W${g.group}`] = finished
      ? { label: g.rows[0].team, resolved: true }
      : ph(`Winner Group ${g.group}`);
    out[`R${g.group}`] = finished
      ? { label: g.rows[1].team, resolved: true }
      : ph(`Runner-up Group ${g.group}`);
    out[`T${g.group}`] = finished
      ? { label: g.rows[2].team, resolved: true }
      : ph(`3rd Group ${g.group}`);
  }
  return out;
}

/**
 * Pairings follow the published 2026 R32 bracket structure. We don't pretend
 * to know which 8 third-placed teams qualify until the group stage finishes;
 * those eight slots stay as "3rd Group X" placeholders until then.
 */
const R32_PAIRS: Array<[string, string]> = [
  ["WA", "RB"],
  ["WC", "RD"],
  ["WE", "RF"],
  ["WG", "RH"],
  ["WI", "RJ"],
  ["WK", "RL"],
  ["WB", "RA"],
  ["WD", "RC"],
  ["WF", "RE"],
  ["WH", "RG"],
  ["WJ", "RI"],
  ["WL", "RK"],
  // Eight slots filled by best 3rd-placed teams, paired with remaining winners.
  ["TA", "TC"],
  ["TB", "TD"],
  ["TE", "TG"],
  ["TF", "TH"],
];

export function buildBracket(standings: GroupStanding[]): BracketMatch[] {
  const slotMap = resolveTopTwo(standings);
  const r32: BracketMatch[] = R32_PAIRS.map(([h, a], i) => ({
    id: `r32-${i + 1}`,
    stage: "round-of-32" as const,
    round: "Round of 32",
    home: slotMap[h] ?? ph(h),
    away: slotMap[a] ?? ph(a),
  }));

  const r16: BracketMatch[] = Array.from({ length: 8 }, (_, i) => ({
    id: `r16-${i + 1}`,
    stage: "round-of-16" as const,
    round: "Round of 16",
    home: ph(`Winner R32-${i * 2 + 1}`),
    away: ph(`Winner R32-${i * 2 + 2}`),
  }));

  const qf: BracketMatch[] = Array.from({ length: 4 }, (_, i) => ({
    id: `qf-${i + 1}`,
    stage: "quarter" as const,
    round: "Quarter-finals",
    home: ph(`Winner R16-${i * 2 + 1}`),
    away: ph(`Winner R16-${i * 2 + 2}`),
  }));

  const sf: BracketMatch[] = Array.from({ length: 2 }, (_, i) => ({
    id: `sf-${i + 1}`,
    stage: "semi" as const,
    round: "Semi-finals",
    home: ph(`Winner QF-${i * 2 + 1}`),
    away: ph(`Winner QF-${i * 2 + 2}`),
  }));

  const third: BracketMatch = {
    id: "third",
    stage: "third",
    round: "Third-place play-off",
    home: ph("Loser SF-1"),
    away: ph("Loser SF-2"),
  };

  const final: BracketMatch = {
    id: "final",
    stage: "final",
    round: "Final",
    home: ph("Winner SF-1"),
    away: ph("Winner SF-2"),
  };

  return [...r32, ...r16, ...qf, ...sf, third, final];
}
