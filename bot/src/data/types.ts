export type GroupLetter =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export type MatchStatus =
  | "scheduled" | "live" | "half-time"
  | "finished" | "postponed" | "cancelled";

export interface Match {
  id: string;
  matchNumber: number;
  group: GroupLetter;
  kickoffUTC: string;
  homeSlot: string;
  awaySlot: string;
  venue: { city: string; country: "USA" | "MEX" | "CAN"; stadium: string; tz: string };
}

export interface MatchEvent {
  minute: number | null;
  side: "home" | "away";
  type: "goal" | "own-goal" | "penalty" | "yellow" | "red";
  player: string;
  assist?: string;
}

export interface LiveMatch {
  matchId: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  minute: number | null;
  events: MatchEvent[];
  fetchedAt: string;
  fromApi: boolean;
}

export interface StandingRow {
  slot: string;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupStanding {
  group: GroupLetter;
  rows: StandingRow[];
}
