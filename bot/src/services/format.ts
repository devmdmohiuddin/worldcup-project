import { resolveSlot } from "../data/teams.js";
import type { GroupStanding, Match } from "../data/types.js";
import type { Strings } from "../i18n/index.js";

export function fmtTime(iso: string, tz = "UTC"): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
    hour12: false,
  }).format(new Date(iso));
}

export function fmtMatchLine(m: Match, strings: Strings, tz = "UTC"): string {
  return strings.matchLine
    .replace("{time}", `${fmtTime(m.kickoffUTC, tz)} (${tz})`)
    .replace("{home}", resolveSlot(m.homeSlot))
    .replace("{away}", resolveSlot(m.awaySlot))
    .replace("{city}", m.venue.city);
}

export function fmtTodayMessage(matches: Match[], strings: Strings, tz = "UTC"): string {
  if (matches.length === 0) return `${strings.todayHeader}\n\n${strings.todayEmpty}`;
  const lines = matches
    .sort((a, b) => a.kickoffUTC.localeCompare(b.kickoffUTC))
    .map((m) => `• ${fmtMatchLine(m, strings, tz)}`);
  return `${strings.todayHeader}\n\n${lines.join("\n")}\n\n${strings.websiteCta}`;
}

export function fmtStandings(standings: GroupStanding[], strings: Strings): string {
  const blocks = standings.map((s) => {
    const header = strings.standingsHeader.replace("{group}", s.group);
    const rows = s.rows.map((r) => {
      const team = r.team.length > 14 ? r.team.slice(0, 13) + "…" : r.team;
      return `  ${team.padEnd(14, " ")} P${r.played} W${r.won} D${r.drawn} L${r.lost} GD${r.goalDifference >= 0 ? "+" : ""}${r.goalDifference} • ${r.points} pts`;
    });
    return `${header}\n${rows.join("\n")}`;
  });
  return `${strings.standingsTitle}\n\n${blocks.join("\n\n")}`;
}
