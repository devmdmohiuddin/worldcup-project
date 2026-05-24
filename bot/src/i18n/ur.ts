import type { Strings } from "./index.js";

export const ur: Strings = {
  langName: "اردو",
  welcome:
    "👋 فٹبال کلین میں خوش آمدید — فیفا ورلڈ کپ 2026 دیکھنے کا صاف ترین طریقہ۔\n\n" +
    "میں آپ کو روزانہ کے میچ، لائیو گول الرٹس، اور ہر میچ کہاں قانونی طور پر دیکھ سکتے ہیں بھیج سکتا ہوں۔\n\n" +
    "آج کے میچز کے لیے /today لکھیں، یا تمام فیچرز کے لیے /help۔",
  helpTitle: "🤖 فٹبال کلین بوٹ — کمانڈز",
  helpBody:
    "/today — آج کے میچز اور وقت\n" +
    "/standings — گروپ پوائنٹس (لائیو)\n" +
    "/team <نام> — اپنی پسندیدہ ٹیم سیٹ کریں (مثلاً /team Mexico)\n" +
    "/team clear — پسندیدہ ٹیم ہٹائیں\n" +
    "/language — زبان تبدیل کریں (EN, BN, UR, AR, HI)\n" +
    "/alerts — لائیو گول الرٹ آن/آف\n" +
    "/digest — روزانہ 9 بجے کا پیغام آن/آف\n" +
    "/website — footballclean.com کھولیں",
  todayHeader: "📅 آج کے میچز",
  todayEmpty: "آج کوئی میچ نہیں۔ مکمل شیڈول ویب سائٹ پر دیکھیں۔",
  matchLine: "{time} · {home} بمقابلہ {away} · {city}",
  standingsTitle: "📊 گروپ پوائنٹس ٹیبل",
  standingsHeader: "گروپ {group}",
  teamPromptMissing:
    "ایک ٹیم کا نام دیں۔ مثال: /team Mexico\n" +
    "پسندیدہ ٹیم ہٹانے کے لیے /team clear۔",
  teamNotFound: "یہ ٹیم نہیں ملی۔ انگریزی میں مکمل نام لکھیں، جیسے /team Mexico۔",
  teamSaved: "⭐ پسندیدہ ٹیم محفوظ: {team}۔ ان کے میچ کے الرٹس ملیں گے۔",
  teamCleared: "پسندیدہ ٹیم ہٹا دی گئی۔",
  noTeamSet: "کوئی پسندیدہ ٹیم سیٹ نہیں۔ /team <نام> آزمائیں۔",
  favTeamHeader: "آپ کی ٹیم: {team}",
  langPickPrompt: "اپنی زبان منتخب کریں:",
  langSaved: "✅ زبان اردو پر سیٹ ہو گئی۔",
  alertsOn: "🔔 گول الرٹس آن۔",
  alertsOff: "🔕 گول الرٹس آف۔",
  digestOn: "📬 روزانہ پیغام آن (9:00)۔",
  digestOff: "📭 روزانہ پیغام آف۔",
  dailyDigestHeader: "🌅 آج ورلڈ کپ میں",
  goalAlertHeader: "⚽ گول!",
  matchStartedHeader: "⏱️ کک آف!",
  whereToWatch: "📍 کہاں دیکھیں: footballclean.com/match/{matchId}",
  websiteCta: "🌐 مکمل شیڈول اور لائیو سکور footballclean.com پر",
  unknownCommand: "میں سمجھا نہیں۔ /help آزمائیں۔",
};
