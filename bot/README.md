# FootballClean Telegram Bot 🤖⚽

Daily World Cup 2026 digests and live goal alerts, in 5 languages. Halal by design — no betting, no piracy, no riba.

## Commands

| Command | Description |
|---|---|
| `/start` | Welcome message + language picker |
| `/help` | Show all commands |
| `/today` | Today's matches (kickoff times in the configured timezone) |
| `/standings` | Live group standings, all 12 groups |
| `/team <name>` | Set favourite team (e.g. `/team Mexico`); `/team clear` to unset |
| `/language` | Pick language: English, বাংলা, اردو, العربية, हिन्दी |
| `/alerts` | Toggle live goal alerts for every match |
| `/digest` | Toggle the daily 9am digest |
| `/website` | Link to footballclean.com |

Users with `goalAlerts: false` still receive goals for their `/team` favourite — opting in to a team is itself an opt-in for that team's notifications.

## Local development

```bash
cd bot
pnpm install
cp .env.example .env
# fill in TELEGRAM_BOT_TOKEN (from @BotFather)
# optionally fill FOOTBALL_DATA_API_KEY (from football-data.org)
pnpm dev      # tsx watch — restarts on file changes
pnpm typecheck
```

The bot uses long-polling, so no public URL is needed for local development.

### Without a football-data.org key

The bot still runs: `/today` and `/standings` use the bundled fixture spec, while live goal alerts are disabled (the poller logs a one-time warning and skips). Useful for testing UX before the tournament starts.

## User data

User prefs (favourite team, language, alert toggles) persist to `data/users.json` by default. On Railway, mount a volume at `/app/data` (or wherever `USERS_FILE` points) for cross-restart persistence on the free tier.

For scale beyond a few thousand users, swap `services/storage.ts` for a Redis or Postgres-backed implementation that satisfies the same async interface.

## Deploying to Railway (free tier)

1. Push the repo to GitHub (the parent `Worldcup_Dream_Project` repo is fine).
2. On [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
3. **Settings → Root Directory** → `bot`.
4. **Settings → Variables**:
   - `TELEGRAM_BOT_TOKEN` — from @BotFather
   - `FOOTBALL_DATA_API_KEY` — from football-data.org (free tier)
   - `DIGEST_TIMEZONE` — IANA tz (e.g. `Asia/Dhaka`, `America/New_York`)
   - `WEBSITE_URL` — `https://footballclean.com`
5. **Settings → Volumes** → mount at `/app/data` and set `USERS_FILE=/app/data/users.json`.
6. Deploy. The start command (`pnpm start`) is configured in `railway.toml`.

Free tier ($5 monthly credit) easily covers a single always-on bot handling tens of thousands of users polling at 60s during the live window.

## Halal compliance

- No betting/gambling promos in any message, ever.
- No piracy links — Where-to-Watch only points to legal broadcasters.
- No third-party ads in DMs.
- Multi-language support prioritises Muslim-majority audiences (BN, UR, AR, HI).

See the parent project's `docs/roadmap.md` for full halal scope.

## Architecture

```
src/
├── index.ts            # entry — wires deps, launches bot + jobs
├── bot.ts              # Telegraf app builder
├── config.ts           # env → BotConfig
├── context.ts          # BotContext + Deps typing
├── commands/           # /start, /help, /today, /standings, /team, /language, /alerts, /digest, /website
├── jobs/
│   ├── dailyDigest.ts  # node-cron, 09:00 in DIGEST_TIMEZONE
│   └── goalAlerts.ts   # 60s poller over live-window matches
├── services/
│   ├── footballData.ts # football-data.org v4 client with TTL cache
│   ├── standings.ts    # group standings from LiveMatch[]
│   ├── format.ts       # message templating
│   └── storage.ts      # JSON-backed UserStore
├── i18n/               # en, bn, ur, ar, hi packs
└── data/               # fixtures spec, teams, venues — mirrors ../lib/
```

If you change `../lib/fixtures.ts` or `../data/teams.json`, sync `bot/src/data/fixtures.ts` and `bot/src/data/teams.ts` accordingly.
