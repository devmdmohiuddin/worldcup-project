export interface BotConfig {
  telegramToken: string;
  footballDataKey: string | null;
  digestTimezone: string;
  usersFile: string;
  pollIntervalSec: number;
  websiteUrl: string;
}

export function loadConfig(): BotConfig {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!telegramToken) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN is required. Create a bot via @BotFather and add it to .env.",
    );
  }
  return {
    telegramToken,
    footballDataKey: process.env.FOOTBALL_DATA_API_KEY?.trim() || null,
    digestTimezone: process.env.DIGEST_TIMEZONE?.trim() || "UTC",
    usersFile: process.env.USERS_FILE?.trim() || "./data/users.json",
    pollIntervalSec: Number(process.env.POLL_INTERVAL_SEC ?? 60),
    websiteUrl: process.env.WEBSITE_URL?.trim() || "https://footballclean.com",
  };
}
