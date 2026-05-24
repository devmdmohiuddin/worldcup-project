import type { BotApp } from "../context.js";
import { getStrings } from "../i18n/index.js";

export function registerHelp(app: BotApp): void {
  app.help(async (ctx) => {
    const strings = getStrings(ctx.user.language);
    await ctx.reply(`${strings.helpTitle}\n\n${strings.helpBody}\n\n${strings.websiteCta}`);
  });
}
