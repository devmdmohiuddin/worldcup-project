import { NextResponse } from "next/server";
import { getLiveMatchesForToday } from "@/lib/api/liveMatches";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const matches = await getLiveMatchesForToday();
    return NextResponse.json({ matches });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ matches: [], error: message }, { status: 200 });
  }
}
