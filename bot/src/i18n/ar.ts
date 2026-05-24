import type { Strings } from "./index.js";

export const ar: Strings = {
  langName: "العربية",
  welcome:
    "👋 أهلاً بك في فوتبول كلين — أنظف طريقة لمتابعة كأس العالم 2026.\n\n" +
    "أرسل لك مباريات اليوم، تنبيهات الأهداف المباشرة، وأين تشاهد كل مباراة بشكل قانوني.\n\n" +
    "اكتب /today لمباريات اليوم، أو /help لكل المزايا.",
  helpTitle: "🤖 بوت فوتبول كلين — الأوامر",
  helpBody:
    "/today — مباريات اليوم وأوقاتها\n" +
    "/standings — ترتيب المجموعات (مباشر)\n" +
    "/team <اسم> — اضبط فريقك المفضل (مثل /team Mexico)\n" +
    "/team clear — حذف الفريق المفضل\n" +
    "/language — تغيير اللغة (EN, BN, UR, AR, HI)\n" +
    "/alerts — تشغيل/إيقاف تنبيهات الأهداف\n" +
    "/digest — تشغيل/إيقاف رسالة 9 صباحاً اليومية\n" +
    "/website — افتح footballclean.com",
  todayHeader: "📅 مباريات اليوم",
  todayEmpty: "لا مباريات اليوم. شاهد الجدول الكامل على الموقع.",
  matchLine: "{time} · {home} ضد {away} · {city}",
  standingsTitle: "📊 ترتيب المجموعات",
  standingsHeader: "المجموعة {group}",
  teamPromptMissing:
    "اكتب اسم فريق. مثال: /team Mexico\n" +
    "لحذف الفريق المفضل: /team clear.",
  teamNotFound: "لم أجد هذا الفريق. اكتب الاسم بالإنجليزية، مثل /team Mexico.",
  teamSaved: "⭐ تم حفظ الفريق المفضل: {team}. ستصلك تنبيهات مبارياتهم.",
  teamCleared: "تم حذف الفريق المفضل.",
  noTeamSet: "لا يوجد فريق مفضل. جرب /team <اسم>.",
  favTeamHeader: "فريقك: {team}",
  langPickPrompt: "اختر لغتك:",
  langSaved: "✅ تم ضبط اللغة على العربية.",
  alertsOn: "🔔 تنبيهات الأهداف مفعّلة.",
  alertsOff: "🔕 تنبيهات الأهداف موقوفة.",
  digestOn: "📬 الرسالة اليومية مفعّلة (9:00).",
  digestOff: "📭 الرسالة اليومية موقوفة.",
  dailyDigestHeader: "🌅 اليوم في كأس العالم",
  goalAlertHeader: "⚽ هدف!",
  matchStartedHeader: "⏱️ بدأت المباراة!",
  whereToWatch: "📍 أين تشاهد: footballclean.com/match/{matchId}",
  websiteCta: "🌐 الجدول الكامل والنتائج المباشرة على footballclean.com",
  unknownCommand: "لم أفهم. جرب /help.",
};
