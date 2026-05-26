/**
 * Diagnostic endpoint — confirm the upstream fixture feed is reachable and
 * surface a clear reason when it's not. Hit `/api/diag` in the browser after
 * setting the API key to see why data is or isn't flowing.
 *
 * No secrets are returned — only booleans + counts + sample team names.
 */
import { NextResponse } from "next/server";
import { getDynamicMatchesBundle } from "@/lib/api/fixtureSync";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  const env = {
    FOOTBALL_DATA_API_KEY: Boolean(process.env.FOOTBALL_DATA_API_KEY),
    FIFA_FIXTURES_URL: Boolean(process.env.FIFA_FIXTURES_URL),
  };

  let upstream: {
    status: "ok" | "error";
    source: "live" | "static";
    sourceLabel?: string;
    totalMatches: number;
    sample: Array<{ matchNumber: number; home: string; away: string; kickoffUTC: string }>;
    error?: string;
  };

  try {
    const bundle = await getDynamicMatchesBundle();
    upstream = {
      status: "ok",
      source: bundle.source,
      sourceLabel: bundle.sourceLabel,
      totalMatches: bundle.matches.length,
      sample: bundle.matches.slice(0, 3).map((m) => ({
        matchNumber: m.matchNumber,
        home: m.homeName ?? m.homeSlot,
        away: m.awayName ?? m.awaySlot,
        kickoffUTC: m.kickoffUTC,
      })),
    };
  } catch (err) {
    upstream = {
      status: "error",
      source: "static",
      totalMatches: 0,
      sample: [],
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }

  return NextResponse.json(
    {
      env,
      upstream,
      tookMs: Date.now() - startedAt,
      hint: upstream.source === "static"
        ? "Set FOOTBALL_DATA_API_KEY (or FIFA_FIXTURES_URL) in .env.local and restart the dev server."
        : "Upstream feed is being used.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
