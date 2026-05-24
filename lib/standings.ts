import { getGroupStageMatches } from "./fixtures";
import { resolveSlot } from "./teams";
import type { GroupLetter, GroupStanding, LiveMatch, StandingRow } from "./types";

const GROUP_LETTERS: GroupLetter[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

function emptyRow(slot: string): StandingRow {
  return {
    slot,
    team: resolveSlot(slot),
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function rowFor(rows: Map<string, StandingRow>, slot: string): StandingRow {
  let r = rows.get(slot);
  if (!r) {
    r = emptyRow(slot);
    rows.set(slot, r);
  }
  return r;
}

/**
 * Compute group standings from completed matches.
 * Sort order: points desc, GD desc, GF desc, team name asc.
 */
export function computeStandings(liveByMatchId: Map<string, LiveMatch>): GroupStanding[] {
  const matches = getGroupStageMatches();
  const byGroup = new Map<GroupLetter, Map<string, StandingRow>>();

  for (const g of GROUP_LETTERS) {
    const rows = new Map<string, StandingRow>();
    for (let i = 1; i <= 4; i++) rowFor(rows, `${g}${i}`);
    byGroup.set(g, rows);
  }

  for (const m of matches) {
    if (!m.group) continue;
    const live = liveByMatchId.get(m.id);
    if (!live || live.status !== "finished") continue;
    if (live.homeScore == null || live.awayScore == null) continue;

    const rows = byGroup.get(m.group);
    if (!rows) continue;
    const home = rowFor(rows, m.homeSlot);
    const away = rowFor(rows, m.awaySlot);

    home.played++;
    away.played++;
    home.goalsFor += live.homeScore;
    home.goalsAgainst += live.awayScore;
    away.goalsFor += live.awayScore;
    away.goalsAgainst += live.homeScore;

    if (live.homeScore > live.awayScore) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (live.homeScore < live.awayScore) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points++;
      away.points++;
    }
  }

  return GROUP_LETTERS.map((g) => {
    const rows = Array.from(byGroup.get(g)!.values()).map((r) => ({
      ...r,
      goalDifference: r.goalsFor - r.goalsAgainst,
    }));
    rows.sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.team.localeCompare(b.team),
    );
    return { group: g, rows };
  });
}
