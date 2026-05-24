import type { BotApp } from "../context.js";
import { getStrings } from "../i18n/index.js";

export function registerToggles(app: BotApp): void {
  app.command("alerts", async (ctx) => {
    const strings = getStrings(ctx.user.language);
    const next = !ctx.user.goalAlerts;
    await ctx.deps.store.upsert(ctx.user.chatId, { goalAlerts: next });
    ctx.user.goalAlerts = next;
    await ctx.reply(next ? strings.alertsOn : strings.alertsOff);
  });

  app.command("digest", async (ctx) => {
    const strings = getStrings(ctx.user.language);
    const next = !ctx.user.dailyDigest;
    await ctx.deps.store.upsert(ctx.user.chatId, { dailyDigest: next });
    ctx.user.dailyDigest = next;
    await ctx.reply(next ? strings.digestOn : strings.digestOff);
  });

  app.command("website", async (ctx) => {
    const strings = getStrings(ctx.user.language);
    await ctx.reply(`${strings.websiteCta}\n${ctx.deps.config.websiteUrl}`);
  });
}
