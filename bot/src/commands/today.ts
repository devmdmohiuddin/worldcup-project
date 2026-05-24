import type { BotApp } from "../context.js";
import { getTodaysMatches } from "../data/fixtures.js";
import { getStrings } from "../i18n/index.js";
import { fmtTodayMessage } from "../services/format.js";

export function registerToday(app: BotApp): void {
  app.command("today", async (ctx) => {
    const strings = getStrings(ctx.user.language);
    const matches = getTodaysMatches();
    await ctx.reply(fmtTodayMessage(matches, strings, ctx.deps.config.digestTimezone));
  });
}
