import teamsData from "@/data/teams.json";
import type { GroupLetter, TeamsData } from "./types";

const TEAMS: TeamsData = teamsData as TeamsData;

/** Resolve a slot code like "A1", "B3" to a team name from data/teams.json. */
export function resolveSlot(slot: string): string {
  const group = slot[0] as GroupLetter;
  const idx = Number(slot.slice(1)) - 1;
  const names = TEAMS.groups[group];
  if (!names || idx < 0 || idx >= names.length) return slot;
  return names[idx];
}

export function listTeamsForGroup(group: GroupLetter): string[] {
  return TEAMS.groups[group] ?? [];
}

export function allTeams(): { group: GroupLetter; name: string; slot: string }[] {
  const out: { group: GroupLetter; name: string; slot: string }[] = [];
  for (const g of Object.keys(TEAMS.groups) as GroupLetter[]) {
    TEAMS.groups[g].forEach((name, i) => {
      out.push({ group: g, name, slot: `${g}${i + 1}` });
    });
  }
  return out;
}
