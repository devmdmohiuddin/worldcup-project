import { Markup } from "telegraf";
import type { BotApp } from "../context.js";
import { getStrings, isLang, listLangButtons } from "../i18n/index.js";

export function registerLanguage(app: BotApp): void {
  app.command("language", async (ctx) => {
    const strings = getStrings(ctx.user.language);
    await ctx.reply(
      strings.langPickPrompt,
      Markup.inlineKeyboard(
        listLangButtons().map((l) => Markup.button.callback(l.label, `setlang:${l.code}`)),
        { columns: 3 },
      ),
    );
  });

  app.action(/^setlang:(\w+)$/, async (ctx) => {
    const code = ctx.match[1];
    if (!code || !isLang(code)) {
      await ctx.answerCbQuery("Unsupported language");
      return;
    }
    await ctx.deps.store.upsert(ctx.user.chatId, { language: code });
    ctx.user.language = code;
    const strings = getStrings(code);
    await ctx.answerCbQuery(strings.langSaved);
    await ctx.editMessageText(strings.langSaved);
  });
}
