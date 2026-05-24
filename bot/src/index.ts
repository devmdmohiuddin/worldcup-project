import { buildBot } from "./bot.js";
import { loadConfig } from "./config.js";
import { startDailyDigest } from "./jobs/dailyDigest.js";
import { startGoalAlerts } from "./jobs/goalAlerts.js";
import { FootballDataClient } from "./services/footballData.js";
import { UserStore } from "./services/storage.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const store = new UserStore(config.usersFile);
  const fdClient = new FootballDataClient(config.footballDataKey);

  const deps = { config, store, fdClient };
  const bot = buildBot(deps);

  startDailyDigest(bot, deps);
  startGoalAlerts(bot, deps);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  await bot.launch();
  console.log(`[bot] running. fd=${fdClient.enabled ? "on" : "off"} tz=${config.digestTimezone}`);
}

main().catch((err) => {
  console.error("[bot] fatal:", err);
  process.exit(1);
});
