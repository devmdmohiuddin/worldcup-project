import cron from "node-cron";
import type { BotApp, BotDeps } from "../context.js";
import { getTodaysMatches } from "../data/fixtures.js";
import { getStrings } from "../i18n/index.js";
import { fmtTodayMessage } from "../services/format.js";

/**
 * Daily 9:00 digest in the configured timezone. Sends "today at the World Cup"
 * to every user who hasn't opted out of /digest. Skips silently on days with
 * no matches to avoid spammy "no matches today" pings.
 */
export function startDailyDigest(app: BotApp, deps: BotDeps): void {
  const { config, store } = deps;

  cron.schedule(
    "0 9 * * *",
    async () => {
      const matches = getTodaysMatches();
      if (matches.length === 0) return;
      const users = await store.all();
      for (const u of users) {
        if (!u.dailyDigest) continue;
        const strings = getStrings(u.language);
        const body = `${strings.dailyDigestHeader}\n\n${fmtTodayMessage(matches, strings, config.digestTimezone)}`;
        try {
          await app.telegram.sendMessage(u.chatId, body);
        } catch (err) {
          console.warn(`[digest] send failed for ${u.chatId}:`, err);
        }
      }
    },
    { timezone: config.digestTimezone },
  );
}
