import broadcastersJson from "@/data/broadcasters.json";
import type {
  Broadcaster,
  BroadcastersData,
  CountryBroadcasters,
} from "./types";

const DATA: BroadcastersData = broadcastersJson as BroadcastersData;

const DEFAULT_COUNTRY = "US";

export function normalizeCountryCode(code: string | null | undefined): string {
  if (!code) return DEFAULT_COUNTRY;
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2) return DEFAULT_COUNTRY;
  return upper;
}

export function getBroadcastersForCountry(
  code: string | null | undefined,
): CountryBroadcasters | null {
  const normalized = normalizeCountryCode(code);
  return DATA.countries[normalized] ?? null;
}

export function getFallbackBroadcasters(): Broadcaster[] {
  return DATA.fallback;
}

export function listSupportedCountries(): {
  code: string;
  name: string;
  flag: string;
}[] {
  return Object.values(DATA.countries)
    .map((c) => ({ code: c.code, name: c.name, flag: c.flag }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function isSupportedCountry(code: string | null | undefined): boolean {
  if (!code) return false;
  return Boolean(DATA.countries[normalizeCountryCode(code)]);
}

/** Sort: free first, then paid; within each tier, TV before streaming for OTA priority. */
export function sortBroadcasters(list: Broadcaster[]): Broadcaster[] {
  const tierRank: Record<string, number> = { free: 0, paid: 1 };
  const typeRank: Record<string, number> = { tv: 0, streaming: 1, radio: 2 };
  return [...list].sort((a, b) => {
    const t = tierRank[a.tier] - tierRank[b.tier];
    if (t !== 0) return t;
    return typeRank[a.type] - typeRank[b.type];
  });
}

/**
 * Resolve the outbound URL for a broadcaster, swapping in an affiliate code
 * when one is configured via env. Falls back to the canonical url.
 */
export function resolveBroadcasterUrl(b: Broadcaster): string {
  if (!b.affiliateUrl) return b.url;
  const affiliateCodes: Record<string, string | undefined> = {
    DAZN: process.env.NEXT_PUBLIC_AFFILIATE_DAZN,
    "ESPN+": process.env.NEXT_PUBLIC_AFFILIATE_ESPN_PLUS,
  };
  const code = affiliateCodes[b.name];
  if (!code) return b.url;
  return b.affiliateUrl.replace("{code}", encodeURIComponent(code));
}

export const BROADCASTERS_UPDATED_AT = DATA.updatedAt;
