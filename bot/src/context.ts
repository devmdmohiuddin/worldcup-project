import type { Context, Telegraf } from "telegraf";
import type { BotConfig } from "./config.js";
import type { FootballDataClient } from "./services/footballData.js";
import type { UserStore, UserPrefs } from "./services/storage.js";

export interface BotDeps {
  config: BotConfig;
  store: UserStore;
  fdClient: FootballDataClient;
}

export interface BotContext extends Context {
  deps: BotDeps;
  user: UserPrefs;
}

export type BotApp = Telegraf<BotContext>;
