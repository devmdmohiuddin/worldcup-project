import type { BotApp } from "../context.js";
import { findTeamByName } from "../data/teams.js";
import { getStrings } from "../i18n/index.js";

export function registerTeam(app: BotApp): void {
  app.command("team", async (ctx) => {
    const strings = getStrings(ctx.user.language);
    const text = ctx.message.text.trim();
    const arg = text.replace(/^\/team(@\w+)?\s*/i, "").trim();

    if (!arg) {
      if (ctx.user.favoriteTeamSlot) {
        const name = (await import("../data/teams.js")).resolveSlot(ctx.user.favoriteTeamSlot);
        await ctx.reply(strings.favTeamHeader.replace("{team}", name));
      } else {
        await ctx.reply(strings.teamPromptMissing);
      }
      return;
    }

    if (arg.toLowerCase() === "clear" || arg.toLowerCase() === "none") {
      await ctx.deps.store.upsert(ctx.user.chatId, { favoriteTeamSlot: null });
      ctx.user.favoriteTeamSlot = null;
      await ctx.reply(strings.teamCleared);
      return;
    }

    const match = findTeamByName(arg);
    if (!match) {
      await ctx.reply(strings.teamNotFound);
      return;
    }
    await ctx.deps.store.upsert(ctx.user.chatId, { favoriteTeamSlot: match.slot });
    ctx.user.favoriteTeamSlot = match.slot;
    await ctx.reply(strings.teamSaved.replace("{team}", match.team));
  });
}
