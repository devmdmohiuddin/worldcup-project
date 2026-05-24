import { en } from "./en.js";
import { bn } from "./bn.js";
import { ur } from "./ur.js";
import { ar } from "./ar.js";
import { hi } from "./hi.js";

export type LangCode = "en" | "bn" | "ur" | "ar" | "hi";

export interface Strings {
  langName: string;
  welcome: string;
  helpTitle: string;
  helpBody: string;
  todayHeader: string;
  todayEmpty: string;
  matchLine: string;
  standingsTitle: string;
  standingsHeader: string;
  teamPromptMissing: string;
  teamNotFound: string;
  teamSaved: string;
  teamCleared: string;
  noTeamSet: string;
  favTeamHeader: string;
  langPickPrompt: string;
  langSaved: string;
  alertsOn: string;
  alertsOff: string;
  digestOn: string;
  digestOff: string;
  dailyDigestHeader: string;
  goalAlertHeader: string;
  matchStartedHeader: string;
  whereToWatch: string;
  websiteCta: string;
  unknownCommand: string;
}

const PACKS: Record<LangCode, Strings> = { en, bn, ur, ar, hi };

export function getStrings(lang: LangCode | string | null | undefined): Strings {
  if (lang && lang in PACKS) return PACKS[lang as LangCode];
  return PACKS.en;
}

export const SUPPORTED_LANGS: LangCode[] = ["en", "bn", "ur", "ar", "hi"];

export function isLang(code: string): code is LangCode {
  return (SUPPORTED_LANGS as string[]).includes(code);
}

export function listLangButtons(): { code: LangCode; label: string }[] {
  return SUPPORTED_LANGS.map((code) => ({ code, label: PACKS[code].langName }));
}
