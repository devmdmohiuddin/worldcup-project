export type GroupLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

export type Stage = "group" | "round-of-32" | "round-of-16" | "quarter" | "semi" | "third" | "final";

export type HostCountry = "USA" | "MEX" | "CAN";

export interface Venue {
  city: string;
  country: HostCountry;
  stadium: string;
  /** IANA timezone of the venue, used to interpret local kickoff times. */
  tz: string;
}

export interface Match {
  /** Unique match id, e.g. "m1". */
  id: string;
  /** FIFA match number 1-104. Group stage covers 1-72. */
  matchNumber: number;
  stage: Stage;
  /** Group letter A-L for group-stage matches; null otherwise. */
  group: GroupLetter | null;
  /** ISO 8601 UTC timestamp for kickoff. */
  kickoffUTC: string;
  /** Team slot codes like "A1", "A2"; resolved to names via teams.json. */
  homeSlot: string;
  awaySlot: string;
  venue: Venue;
}

export interface TeamsData {
  groups: Record<GroupLetter, string[]>;
}

export type MatchStatus =
  | "scheduled"
  | "live"
  | "half-time"
  | "finished"
  | "postponed"
  | "cancelled";

export type EventType = "goal" | "own-goal" | "penalty" | "yellow" | "red";

export interface MatchEvent {
  /** Minute of play, 1-120. `null` allowed when unknown (e.g. just-ingested). */
  minute: number | null;
  /** "home" or "away" — which side the event belongs to. */
  side: "home" | "away";
  type: EventType;
  /** Player name; may be empty if the upstream feed omits it. */
  player: string;
  /** For an assist, the assisting player's name (goals only). */
  assist?: string;
}

export interface LiveMatch {
  matchId: string;
  status: MatchStatus;
  /** Current scoreline; both null pre-kickoff. */
  homeScore: number | null;
  awayScore: number | null;
  /** Current minute (1-120) when live; null otherwise. */
  minute: number | null;
  events: MatchEvent[];
  /** When this snapshot was fetched (ISO UTC). */
  fetchedAt: string;
  /** True if the API returned data; false when we served a placeholder. */
  fromApi: boolean;
}

export interface GroupStanding {
  group: GroupLetter;
  rows: StandingRow[];
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

export interface BracketSlot {
  /** Display label, e.g. "Winner Group A" or a resolved team name. */
  label: string;
  /** True once the slot resolves to a concrete team. */
  resolved: boolean;
}

export interface BracketMatch {
  id: string;
  stage: Stage;
  /** Round label like "Round of 32", "Quarter-finals". */
  round: string;
  home: BracketSlot;
  away: BracketSlot;
}
