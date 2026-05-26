import teamsData from "@/data/teams.json";
import type { GroupLetter, TeamsData } from "./types";

const TEAMS: TeamsData = teamsData as TeamsData;

// Team name → ISO 3166-1 alpha-2 code, used to render flag emoji.
// Covers confirmed hosts and the realistic FIFA-2026 entrant pool.
// New entries can be appended as the draw resolves remaining TBD slots.
const TEAM_CC: Record<string, string> = {
  Mexico: "MX",
  "South Africa": "ZA",
  Canada: "CA",
  USA: "US",
  "United States": "US",
  "United States of America": "US",
  Argentina: "AR",
  Brazil: "BR",
  France: "FR",
  Germany: "DE",
  England: "GB",
  Spain: "ES",
  Portugal: "PT",
  Italy: "IT",
  Netherlands: "NL",
  Belgium: "BE",
  Croatia: "HR",
  Switzerland: "CH",
  Denmark: "DK",
  Poland: "PL",
  Serbia: "RS",
  Austria: "AT",
  "Czech Republic": "CZ",
  Czechia: "CZ",
  Norway: "NO",
  Wales: "GB",
  Scotland: "GB",
  "Republic of Ireland": "IE",
  Türkiye: "TR",
  Turkey: "TR",
  Ukraine: "UA",
  Hungary: "HU",
  Slovakia: "SK",
  Slovenia: "SI",
  Sweden: "SE",
  Finland: "FI",
  Albania: "AL",
  Romania: "RO",
  Bosnia: "BA",
  "Bosnia and Herzegovina": "BA",
  Greece: "GR",
  Japan: "JP",
  "Korea Republic": "KR",
  "South Korea": "KR",
  Australia: "AU",
  "Saudi Arabia": "SA",
  Iran: "IR",
  Iraq: "IQ",
  Qatar: "QA",
  "United Arab Emirates": "AE",
  Jordan: "JO",
  Uzbekistan: "UZ",
  "New Zealand": "NZ",
  Senegal: "SN",
  Morocco: "MA",
  Tunisia: "TN",
  Algeria: "DZ",
  Egypt: "EG",
  Ghana: "GH",
  Nigeria: "NG",
  Cameroon: "CM",
  "Ivory Coast": "CI",
  "Côte d'Ivoire": "CI",
  "Cote d'Ivoire": "CI",
  Mali: "ML",
  "Cape Verde": "CV",
  Uruguay: "UY",
  Colombia: "CO",
  Chile: "CL",
  Peru: "PE",
  Ecuador: "EC",
  Paraguay: "PY",
  Venezuela: "VE",
  Bolivia: "BO",
  Panama: "PA",
  "Costa Rica": "CR",
  Jamaica: "JM",
  Honduras: "HN",
  "El Salvador": "SV",
  Guatemala: "GT",
  Curaçao: "CW",
  Curacao: "CW",
  Haiti: "HT",
  Suriname: "SR",
};

/** Convert an ISO 3166-1 alpha-2 code into the corresponding flag emoji. */
export function flagEmoji(cc: string): string {
  if (cc.length !== 2) return "";
  const base = 0x1f1e6;
  return String.fromCodePoint(
    base + (cc.charCodeAt(0) - 65),
    base + (cc.charCodeAt(1) - 65),
  );
}

/** Return the flag emoji for a team name, or an empty string for TBD/unknown. */
export function teamFlag(team: string): string {
  const cc = TEAM_CC[team];
  return cc ? flagEmoji(cc) : "";
}

/** Country code for a team name, or null if unknown / TBD. */
export function teamCountryCode(team: string): string | null {
  return TEAM_CC[team] ?? null;
}

interface ResolvedTeam {
  /** Best-known team name (override → slot resolution → slot code). */
  name: string;
  /** ISO 3166-1 alpha-2 country code, or null when unknown. */
  cc: string | null;
  /** True when the slot hasn't been filled with a real team yet. */
  placeholder: boolean;
}

/**
 * Resolve a team for a fixture side, preferring an upstream-supplied name
 * over `teams.json` and falling back to the raw slot code when neither
 * source has a value yet.
 */
export function resolveTeam(
  slot: string,
  override?: string,
  overrideCC?: string,
): ResolvedTeam {
  const overrideName = override?.trim();
  if (overrideName) {
    return {
      name: overrideName,
      cc: overrideCC ?? teamCountryCode(overrideName),
      placeholder: false,
    };
  }
  const resolved = resolveSlot(slot);
  const placeholder = resolved.startsWith("TBD") || resolved === slot;
  return {
    name: placeholder ? slot : resolved,
    cc: placeholder ? null : teamCountryCode(resolved),
    placeholder,
  };
}

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
