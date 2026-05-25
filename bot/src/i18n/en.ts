import type { Strings } from "./index.js";

export const en: Strings = {
  langName: "English",
  welcome:
    "👋 Welcome to MatchHub — the cleanest way to follow the FIFA World Cup 2026.\n\n" +
    "I can send you daily match digests, live goal alerts, and tell you where to watch every match legally.\n\n" +
    "Try /today to see today's fixtures, or /help to see everything I can do.",
  helpTitle: "🤖 MatchHub Bot — Commands",
  helpBody:
    "/today — Today's matches with kickoff times\n" +
    "/standings — Group standings (live)\n" +
    "/team <name> — Set your favourite team (e.g. /team Mexico)\n" +
    "/team clear — Clear favourite team\n" +
    "/language — Change language (EN, BN, UR, AR, HI)\n" +
    "/alerts — Toggle live goal alerts\n" +
    "/digest — Toggle daily 9am digest\n" +
    "/website — Open matchhub.live",
  todayHeader: "📅 Today's matches",
  todayEmpty: "No matches today. Check /tomorrow or visit the website for the full schedule.",
  matchLine: "{time} · {home} vs {away} · {city}",
  standingsTitle: "📊 Group Standings",
  standingsHeader: "Group {group}",
  teamPromptMissing:
    "Tell me a team name. Example: /team Mexico\n" + "Use /team clear to remove your favourite.",
  teamNotFound: "I couldn't find that team. Try the full English name, e.g. /team Mexico.",
  teamSaved: "⭐ Favourite team saved: {team}. You'll get alerts for their matches.",
  teamCleared: "Favourite team cleared.",
  noTeamSet: "No favourite team set. Try /team <name>.",
  favTeamHeader: "Your team: {team}",
  langPickPrompt: "Pick your language:",
  langSaved: "✅ Language set to English.",
  alertsOn: "🔔 Goal alerts ON.",
  alertsOff: "🔕 Goal alerts OFF.",
  digestOn: "📬 Daily digest ON (9:00).",
  digestOff: "📭 Daily digest OFF.",
  dailyDigestHeader: "🌅 Today at the World Cup",
  goalAlertHeader: "⚽ GOAL!",
  matchStartedHeader: "⏱️ Kickoff!",
  whereToWatch: "📍 Where to watch: matchhub.live/match/{matchId}",
  websiteCta: "🌐 Full schedule, live scores, and Where-to-Watch on matchhub.live",
  unknownCommand: "I didn't catch that. Try /help.",
};
