import type { Strings } from "./index.js";

export const hi: Strings = {
  langName: "हिन्दी",
  welcome:
    "👋 FootballClean में स्वागत है — फीफा वर्ल्ड कप 2026 देखने का सबसे साफ तरीका।\n\n" +
    "मैं आपको रोज़ाना के मैच, लाइव गोल अलर्ट, और हर मैच कहाँ कानूनी रूप से देखें भेज सकता हूँ।\n\n" +
    "आज के मैच देखने के लिए /today लिखें, या सभी फीचर के लिए /help।",
  helpTitle: "🤖 FootballClean बॉट — कमांड",
  helpBody:
    "/today — आज के मैच और समय\n" +
    "/standings — ग्रुप पॉइंट टेबल (लाइव)\n" +
    "/team <नाम> — पसंदीदा टीम सेट करें (जैसे /team Mexico)\n" +
    "/team clear — पसंदीदा टीम हटाएँ\n" +
    "/language — भाषा बदलें (EN, BN, UR, AR, HI)\n" +
    "/alerts — गोल अलर्ट चालू/बंद\n" +
    "/digest — सुबह 9 बजे का दैनिक संदेश चालू/बंद\n" +
    "/website — footballclean.com खोलें",
  todayHeader: "📅 आज के मैच",
  todayEmpty: "आज कोई मैच नहीं। पूरा शेड्यूल वेबसाइट पर देखें।",
  matchLine: "{time} · {home} बनाम {away} · {city}",
  standingsTitle: "📊 ग्रुप स्टैंडिंग्स",
  standingsHeader: "ग्रुप {group}",
  teamPromptMissing:
    "एक टीम का नाम दें। उदाहरण: /team Mexico\n" +
    "पसंदीदा टीम हटाने के लिए: /team clear।",
  teamNotFound: "वह टीम नहीं मिली। अंग्रेज़ी में पूरा नाम लिखें, जैसे /team Mexico।",
  teamSaved: "⭐ पसंदीदा टीम सेव हुई: {team}। उनके मैच के अलर्ट मिलेंगे।",
  teamCleared: "पसंदीदा टीम हटा दी गई।",
  noTeamSet: "कोई पसंदीदा टीम सेट नहीं है। /team <नाम> आज़माएँ।",
  favTeamHeader: "आपकी टीम: {team}",
  langPickPrompt: "अपनी भाषा चुनें:",
  langSaved: "✅ भाषा हिन्दी पर सेट हो गई।",
  alertsOn: "🔔 गोल अलर्ट चालू।",
  alertsOff: "🔕 गोल अलर्ट बंद।",
  digestOn: "📬 दैनिक संदेश चालू (9:00)।",
  digestOff: "📭 दैनिक संदेश बंद।",
  dailyDigestHeader: "🌅 आज वर्ल्ड कप में",
  goalAlertHeader: "⚽ गोल!",
  matchStartedHeader: "⏱️ किकऑफ!",
  whereToWatch: "📍 कहाँ देखें: footballclean.com/match/{matchId}",
  websiteCta: "🌐 पूरा शेड्यूल और लाइव स्कोर footballclean.com पर",
  unknownCommand: "समझा नहीं। /help आज़माएँ।",
};
