import type { BotApp } from "../context.js";
import { getGroupStageMatches } from "../data/fixtures.js";
import { getStrings } from "../i18n/index.js";
import { fmtStandings } from "../services/format.js";
import { computeStandings } from "../services/standings.js";
import type { LiveMatch } from "../data/types.js";

export function registerStandings(app: BotApp): void {
  app.command("standings", async (ctx) => {
    const strings = getStrings(ctx.user.language);
    const { fdClient } = ctx.deps;

    const matchIds = getGroupStageMatches().map((m) => m.id);
    const live = new Map<string, LiveMatch>();
    if (fdClient.enabled) {
      const liveMatches = await fdClient.getLiveMatchesForIds(matchIds);
      for (const lm of liveMatches) live.set(lm.matchId, lm);
    }

    await ctx.reply(`\`\`\`\n${fmtStandings(computeStandings(live), strings)}\n\`\`\``, {
      parse_mode: "Markdown",
    });
  });
}
