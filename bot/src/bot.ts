import { Telegraf } from "telegraf";
import type { BotApp, BotContext, BotDeps } from "./context.js";
import { registerStart } from "./commands/start.js";
import { registerHelp } from "./commands/help.js";
import { registerToday } from "./commands/today.js";
import { registerStandings } from "./commands/standings.js";
import { registerTeam } from "./commands/team.js";
import { registerLanguage } from "./commands/language.js";
import { registerToggles } from "./commands/toggles.js";
import { getStrings } from "./i18n/index.js";

export function buildBot(deps: BotDeps): BotApp {
  const app = new Telegraf<BotContext>(deps.config.telegramToken);

  app.context.deps = deps;

  // Inject the user record on every update before commands run.
  app.use(async (ctx, next) => {
    const chatId = ctx.chat?.id ?? ctx.from?.id;
    if (chatId) {
      const existing = await deps.store.get(chatId);
      ctx.user = existing ?? (await deps.store.upsert(chatId, {}));
    }
    return next();
  });

  registerStart(app);
  registerHelp(app);
  registerToday(app);
  registerStandings(app);
  registerTeam(app);
  registerLanguage(app);
  registerToggles(app);

  app.on("text", async (ctx) => {
    if (!ctx.user) return;
    const strings = getStrings(ctx.user.language);
    if (ctx.message.text.startsWith("/")) {
      await ctx.reply(strings.unknownCommand);
    }
  });

  app.catch((err, ctx) => {
    console.error(`[bot] update ${ctx.update.update_id} failed:`, err);
  });

  return app;
}
