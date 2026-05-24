import { NextResponse } from "next/server";
import { getBestGoals, listAllHighlights } from "@/lib/api/highlights";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const highlights = await listAllHighlights();
    return NextResponse.json({
      highlights,
      bestGoals: getBestGoals(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { highlights: [], bestGoals: getBestGoals(), error: message },
      { status: 200 },
    );
  }
}
