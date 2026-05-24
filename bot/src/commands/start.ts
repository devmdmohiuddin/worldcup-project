import { Markup } from "telegraf";
import type { BotApp } from "../context.js";
import { getStrings, listLangButtons } from "../i18n/index.js";

export function registerStart(app: BotApp): void {
  app.start(async (ctx) => {
    const strings = getStrings(ctx.user.language);
    await ctx.reply(
      strings.welcome,
      Markup.keyboard([
        ["/today", "/standings"],
        ["/team", "/language"],
        ["/help"],
      ]).resize(),
    );
    if (!ctx.user.language || ctx.user.language === "en") {
      await ctx.reply(
        strings.langPickPrompt,
        Markup.inlineKeyboard(
          listLangButtons().map((l) => Markup.button.callback(l.label, `setlang:${l.code}`)),
          { columns: 3 },
        ),
      );
    }
  });
}
