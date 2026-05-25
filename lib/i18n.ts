/**
 * Tiny in-house i18n layer.
 *
 * We deliberately don't pull in next-intl / i18next — the surface area for this
 * product is small (5 languages, a few dozen strings) and a runtime dictionary
 * keeps client bundle size minimal.
 *
 * Language is persisted in a cookie and a localStorage mirror so the choice
 * survives across navigations and reloads.
 */

export type Locale = "en" | "bn" | "ur" | "ar" | "hi";

export const LOCALES: { code: Locale; label: string; nativeLabel: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", dir: "ltr" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", dir: "rtl" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" },
];

export const LOCALE_COOKIE = "mh_locale";
export const LOCALE_CHANGE_EVENT = "fc-locale-change";

export type TranslationKey =
  | "nav.schedule"
  | "nav.standings"
  | "nav.bracket"
  | "nav.highlights"
  | "nav.notifications"
  | "schedule.title"
  | "schedule.timesIn"
  | "schedule.allDates"
  | "schedule.allGroups"
  | "schedule.allTeams"
  | "schedule.allStages"
  | "schedule.group"
  | "schedule.team"
  | "schedule.stage"
  | "schedule.date"
  | "schedule.reset"
  | "schedule.noMatches"
  | "schedule.showing"
  | "match.vs"
  | "match.fullTime"
  | "match.kickoff"
  | "match.venue"
  | "notifications.title"
  | "notifications.subtitle"
  | "notifications.enable"
  | "notifications.disable"
  | "notifications.enabled"
  | "notifications.goalAlerts"
  | "notifications.matchStart"
  | "notifications.favoriteTeam"
  | "notifications.pickATeam"
  | "notifications.unsupported"
  | "notifications.permissionDenied"
  | "common.loading"
  | "common.save"
  | "common.cancel"
  | "common.minutes"
  | "common.before"
  | "common.after";

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  "nav.schedule": "Schedule",
  "nav.standings": "Standings",
  "nav.bracket": "Bracket",
  "nav.highlights": "Highlights",
  "nav.notifications": "Notifications",
  "schedule.title": "World Cup 2026 Schedule",
  "schedule.timesIn": "All {count} group-stage matches · times shown in",
  "schedule.allDates": "All dates",
  "schedule.allGroups": "All groups",
  "schedule.allTeams": "All teams",
  "schedule.allStages": "All stages",
  "schedule.group": "Group",
  "schedule.team": "Team",
  "schedule.stage": "Stage",
  "schedule.date": "Date",
  "schedule.reset": "Reset filters",
  "schedule.noMatches": "No matches match the current filters.",
  "schedule.showing": "Showing {n} of {total} matches",
  "match.vs": "vs",
  "match.fullTime": "Full time",
  "match.kickoff": "Kick-off",
  "match.venue": "Venue",
  "notifications.title": "Notification preferences",
  "notifications.subtitle":
    "We'll only send what you ask for. No ads, no tracking, no third parties.",
  "notifications.enable": "Enable browser notifications",
  "notifications.disable": "Disable notifications",
  "notifications.enabled": "Notifications enabled in this browser.",
  "notifications.goalAlerts": "Goal alerts for my favorite team",
  "notifications.matchStart": "Match start reminders (15 min before kick-off)",
  "notifications.favoriteTeam": "Favorite team",
  "notifications.pickATeam": "Pick a team…",
  "notifications.unsupported": "This browser does not support push notifications.",
  "notifications.permissionDenied":
    "Notifications are blocked for this site. Enable them from your browser settings.",
  "common.loading": "Loading…",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.minutes": "min",
  "common.before": "before",
  "common.after": "after",
};

const bn: Dictionary = {
  "nav.schedule": "সূচি",
  "nav.standings": "পয়েন্ট তালিকা",
  "nav.bracket": "ব্র্যাকেট",
  "nav.highlights": "হাইলাইট",
  "nav.notifications": "নোটিফিকেশন",
  "schedule.title": "বিশ্বকাপ ২০২৬ সূচি",
  "schedule.timesIn": "সব {count}টি গ্রুপপর্বের ম্যাচ · সময় দেখানো হচ্ছে",
  "schedule.allDates": "সব তারিখ",
  "schedule.allGroups": "সব গ্রুপ",
  "schedule.allTeams": "সব দল",
  "schedule.allStages": "সব পর্ব",
  "schedule.group": "গ্রুপ",
  "schedule.team": "দল",
  "schedule.stage": "পর্ব",
  "schedule.date": "তারিখ",
  "schedule.reset": "ফিল্টার রিসেট",
  "schedule.noMatches": "কোনো ম্যাচ ফিল্টারের সাথে মিলছে না।",
  "schedule.showing": "{total}-এর মধ্যে {n}টি ম্যাচ দেখানো হচ্ছে",
  "match.vs": "বনাম",
  "match.fullTime": "পূর্ণ সময়",
  "match.kickoff": "কিকঅফ",
  "match.venue": "ভেন্যু",
  "notifications.title": "নোটিফিকেশন সেটিংস",
  "notifications.subtitle": "আপনি যা চাইবেন কেবল সেটাই পাঠাব। কোনো বিজ্ঞাপন বা ট্র্যাকিং নেই।",
  "notifications.enable": "ব্রাউজার নোটিফিকেশন চালু করুন",
  "notifications.disable": "নোটিফিকেশন বন্ধ করুন",
  "notifications.enabled": "এই ব্রাউজারে নোটিফিকেশন চালু আছে।",
  "notifications.goalAlerts": "আমার প্রিয় দলের গোলের নোটিফিকেশন",
  "notifications.matchStart": "ম্যাচ শুরুর ১৫ মিনিট আগে রিমাইন্ডার",
  "notifications.favoriteTeam": "প্রিয় দল",
  "notifications.pickATeam": "একটি দল বেছে নিন…",
  "notifications.unsupported": "এই ব্রাউজার পুশ নোটিফিকেশন সাপোর্ট করে না।",
  "notifications.permissionDenied":
    "এই সাইটের জন্য নোটিফিকেশন ব্লক হয়ে গেছে। ব্রাউজার সেটিংস থেকে চালু করুন।",
  "common.loading": "লোড হচ্ছে…",
  "common.save": "সেভ",
  "common.cancel": "বাতিল",
  "common.minutes": "মিনিট",
  "common.before": "আগে",
  "common.after": "পরে",
};

const ur: Dictionary = {
  "nav.schedule": "شیڈول",
  "nav.standings": "پوائنٹس ٹیبل",
  "nav.bracket": "بریکٹ",
  "nav.highlights": "ہائی لائٹس",
  "nav.notifications": "اطلاعات",
  "schedule.title": "ورلڈ کپ 2026 شیڈول",
  "schedule.timesIn": "تمام {count} گروپ مرحلے کے میچ · اوقات اس میں",
  "schedule.allDates": "تمام تاریخیں",
  "schedule.allGroups": "تمام گروپ",
  "schedule.allTeams": "تمام ٹیمیں",
  "schedule.allStages": "تمام مراحل",
  "schedule.group": "گروپ",
  "schedule.team": "ٹیم",
  "schedule.stage": "مرحلہ",
  "schedule.date": "تاریخ",
  "schedule.reset": "فلٹرز ری سیٹ کریں",
  "schedule.noMatches": "موجودہ فلٹرز سے کوئی میچ نہیں ملا۔",
  "schedule.showing": "{total} میں سے {n} میچ دکھائے جا رہے ہیں",
  "match.vs": "بمقابلہ",
  "match.fullTime": "مکمل وقت",
  "match.kickoff": "کک آف",
  "match.venue": "مقام",
  "notifications.title": "اطلاعات کی ترجیحات",
  "notifications.subtitle":
    "ہم صرف وہی بھیجیں گے جس کی آپ نے درخواست کی۔ کوئی اشتہار یا ٹریکنگ نہیں۔",
  "notifications.enable": "براؤزر اطلاعات فعال کریں",
  "notifications.disable": "اطلاعات غیر فعال کریں",
  "notifications.enabled": "اس براؤزر میں اطلاعات فعال ہیں۔",
  "notifications.goalAlerts": "میری پسندیدہ ٹیم کے گول کی اطلاعات",
  "notifications.matchStart": "میچ شروع ہونے سے 15 منٹ پہلے یاد دہانی",
  "notifications.favoriteTeam": "پسندیدہ ٹیم",
  "notifications.pickATeam": "ایک ٹیم منتخب کریں…",
  "notifications.unsupported": "یہ براؤزر پش اطلاعات کو سپورٹ نہیں کرتا۔",
  "notifications.permissionDenied": "اس سائٹ کے لیے اطلاعات بلاک ہیں۔ براؤزر سیٹنگز سے فعال کریں۔",
  "common.loading": "لوڈ ہو رہا ہے…",
  "common.save": "محفوظ کریں",
  "common.cancel": "منسوخ",
  "common.minutes": "منٹ",
  "common.before": "پہلے",
  "common.after": "بعد",
};

const ar: Dictionary = {
  "nav.schedule": "الجدول",
  "nav.standings": "الترتيب",
  "nav.bracket": "الأقواس",
  "nav.highlights": "الملخصات",
  "nav.notifications": "الإشعارات",
  "schedule.title": "جدول كأس العالم 2026",
  "schedule.timesIn": "كل مباريات دور المجموعات الـ{count} · الأوقات معروضة بـ",
  "schedule.allDates": "كل التواريخ",
  "schedule.allGroups": "كل المجموعات",
  "schedule.allTeams": "كل الفرق",
  "schedule.allStages": "كل الأدوار",
  "schedule.group": "المجموعة",
  "schedule.team": "الفريق",
  "schedule.stage": "الدور",
  "schedule.date": "التاريخ",
  "schedule.reset": "إعادة ضبط الفلاتر",
  "schedule.noMatches": "لا توجد مباريات تطابق الفلاتر الحالية.",
  "schedule.showing": "عرض {n} من أصل {total} مباراة",
  "match.vs": "ضد",
  "match.fullTime": "وقت كامل",
  "match.kickoff": "بداية المباراة",
  "match.venue": "الملعب",
  "notifications.title": "إعدادات الإشعارات",
  "notifications.subtitle": "نرسل فقط ما تطلبه. لا إعلانات ولا تتبع ولا أطراف خارجية.",
  "notifications.enable": "تفعيل إشعارات المتصفح",
  "notifications.disable": "تعطيل الإشعارات",
  "notifications.enabled": "الإشعارات مفعلة في هذا المتصفح.",
  "notifications.goalAlerts": "تنبيهات الأهداف لفريقي المفضل",
  "notifications.matchStart": "تذكير ببداية المباراة (قبل 15 دقيقة)",
  "notifications.favoriteTeam": "الفريق المفضل",
  "notifications.pickATeam": "اختر فريقًا…",
  "notifications.unsupported": "هذا المتصفح لا يدعم إشعارات الدفع.",
  "notifications.permissionDenied": "الإشعارات محظورة لهذا الموقع. فعّلها من إعدادات المتصفح.",
  "common.loading": "جارٍ التحميل…",
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.minutes": "دقيقة",
  "common.before": "قبل",
  "common.after": "بعد",
};

const hi: Dictionary = {
  "nav.schedule": "शेड्यूल",
  "nav.standings": "पॉइंट्स टेबल",
  "nav.bracket": "ब्रैकेट",
  "nav.highlights": "हाइलाइट्स",
  "nav.notifications": "नोटिफिकेशन",
  "schedule.title": "विश्व कप 2026 शेड्यूल",
  "schedule.timesIn": "सभी {count} ग्रुप-स्टेज मैच · समय दिखाया जा रहा है",
  "schedule.allDates": "सभी तिथियाँ",
  "schedule.allGroups": "सभी ग्रुप",
  "schedule.allTeams": "सभी टीमें",
  "schedule.allStages": "सभी चरण",
  "schedule.group": "ग्रुप",
  "schedule.team": "टीम",
  "schedule.stage": "चरण",
  "schedule.date": "तिथि",
  "schedule.reset": "फ़िल्टर रीसेट करें",
  "schedule.noMatches": "मौजूदा फ़िल्टर से कोई मैच नहीं मिला।",
  "schedule.showing": "{total} में से {n} मैच दिखाए जा रहे हैं",
  "match.vs": "बनाम",
  "match.fullTime": "पूर्ण समय",
  "match.kickoff": "किक-ऑफ़",
  "match.venue": "स्थान",
  "notifications.title": "नोटिफिकेशन प्राथमिकताएँ",
  "notifications.subtitle": "हम केवल वही भेजेंगे जो आप माँगेंगे। कोई विज्ञापन या ट्रैकिंग नहीं।",
  "notifications.enable": "ब्राउज़र नोटिफिकेशन सक्षम करें",
  "notifications.disable": "नोटिफिकेशन अक्षम करें",
  "notifications.enabled": "इस ब्राउज़र में नोटिफिकेशन सक्षम हैं।",
  "notifications.goalAlerts": "मेरी पसंदीदा टीम के गोल का अलर्ट",
  "notifications.matchStart": "मैच शुरू होने से 15 मिनट पहले रिमाइंडर",
  "notifications.favoriteTeam": "पसंदीदा टीम",
  "notifications.pickATeam": "एक टीम चुनें…",
  "notifications.unsupported": "यह ब्राउज़र पुश नोटिफिकेशन का समर्थन नहीं करता।",
  "notifications.permissionDenied":
    "इस साइट के लिए नोटिफिकेशन अवरुद्ध हैं। ब्राउज़र सेटिंग से सक्षम करें।",
  "common.loading": "लोड हो रहा है…",
  "common.save": "सहेजें",
  "common.cancel": "रद्द करें",
  "common.minutes": "मिनट",
  "common.before": "पहले",
  "common.after": "बाद",
};

const DICTIONARIES: Record<Locale, Dictionary> = { en, bn, ur, ar, hi };

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const dict = DICTIONARIES[locale] ?? DICTIONARIES.en;
  let str = dict[key] ?? DICTIONARIES.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && LOCALES.some((l) => l.code === value);
}

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";
}

export function readLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split(";").find((c) => c.trim().startsWith(`${LOCALE_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.split("=")[1] ?? "").trim();
  return isLocale(value) ? value : null;
}

export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.documentElement.lang = locale;
  document.documentElement.dir = getLocaleDir(locale);
  window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: locale }));
}
