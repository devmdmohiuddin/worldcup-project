import { NextResponse } from "next/server";
import { getGroupStageMatches } from "@/lib/fixtures";
import { getLiveMatch } from "@/lib/api/liveMatches";
import { computeStandings } from "@/lib/standings";
import type { LiveMatch } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const matches = getGroupStageMatches();
    const liveByMatchId = new Map<string, LiveMatch>();
    // We need every group-stage match status to compute standings. Each call is
    // cache-first, so even 72 lookups translate to ~0 upstream requests inside
    // the cache window.
    for (const m of matches) {
      liveByMatchId.set(m.id, await getLiveMatch(m.id));
    }
    const standings = computeStandings(liveByMatchId);
    return NextResponse.json({ standings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ standings: [], error: message }, { status: 200 });
  }
}
