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
