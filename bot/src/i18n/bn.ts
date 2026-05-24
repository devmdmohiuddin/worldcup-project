import type { Strings } from "./index.js";

export const bn: Strings = {
  langName: "বাংলা",
  welcome:
    "👋 ফুটবলক্লিন বটে স্বাগতম — ফিফা বিশ্বকাপ ২০২৬ দেখার সবচেয়ে পরিষ্কার উপায়।\n\n" +
    "আমি প্রতিদিনের ম্যাচ আপডেট, লাইভ গোল অ্যালার্ট, এবং প্রতিটি ম্যাচ কোথায় বৈধভাবে দেখা যাবে তা পাঠাতে পারি।\n\n" +
    "আজকের ম্যাচ দেখতে /today লিখুন, অথবা সব ফিচার দেখতে /help লিখুন।",
  helpTitle: "🤖 ফুটবলক্লিন বট — কমান্ড",
  helpBody:
    "/today — আজকের ম্যাচ ও সময়\n" +
    "/standings — গ্রুপ পয়েন্ট তালিকা (লাইভ)\n" +
    "/team <নাম> — প্রিয় দল সেট করুন (যেমন /team Mexico)\n" +
    "/team clear — প্রিয় দল মুছুন\n" +
    "/language — ভাষা পরিবর্তন (EN, BN, UR, AR, HI)\n" +
    "/alerts — গোল অ্যালার্ট চালু/বন্ধ\n" +
    "/digest — দৈনিক সকাল ৯টার বার্তা চালু/বন্ধ\n" +
    "/website — footballclean.com খুলুন",
  todayHeader: "📅 আজকের ম্যাচসমূহ",
  todayEmpty: "আজ কোনো ম্যাচ নেই। সম্পূর্ণ সূচি ওয়েবসাইটে দেখুন।",
  matchLine: "{time} · {home} বনাম {away} · {city}",
  standingsTitle: "📊 গ্রুপ পয়েন্ট তালিকা",
  standingsHeader: "গ্রুপ {group}",
  teamPromptMissing:
    "একটি দলের নাম দিন। উদাহরণ: /team Mexico\n" +
    "প্রিয় দল মুছতে /team clear।",
  teamNotFound: "এই দলটি খুঁজে পাইনি। ইংরেজিতে পুরো নাম লিখুন, যেমন /team Mexico।",
  teamSaved: "⭐ প্রিয় দল সংরক্ষিত: {team}। তাদের ম্যাচের অ্যালার্ট পাবেন।",
  teamCleared: "প্রিয় দল মুছে ফেলা হয়েছে।",
  noTeamSet: "কোনো প্রিয় দল সেট করা নেই। /team <নাম> দিয়ে চেষ্টা করুন।",
  favTeamHeader: "আপনার দল: {team}",
  langPickPrompt: "আপনার ভাষা নির্বাচন করুন:",
  langSaved: "✅ ভাষা বাংলায় সেট করা হয়েছে।",
  alertsOn: "🔔 গোল অ্যালার্ট চালু।",
  alertsOff: "🔕 গোল অ্যালার্ট বন্ধ।",
  digestOn: "📬 দৈনিক বার্তা চালু (৯:০০)।",
  digestOff: "📭 দৈনিক বার্তা বন্ধ।",
  dailyDigestHeader: "🌅 আজকের বিশ্বকাপ",
  goalAlertHeader: "⚽ গোল!",
  matchStartedHeader: "⏱️ ম্যাচ শুরু!",
  whereToWatch: "📍 কোথায় দেখবেন: footballclean.com/match/{matchId}",
  websiteCta: "🌐 সম্পূর্ণ সূচি ও লাইভ স্কোর footballclean.com এ",
  unknownCommand: "বুঝতে পারিনি। /help চেষ্টা করুন।",
};
