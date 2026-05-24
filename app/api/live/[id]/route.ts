import { NextResponse } from "next/server";
import { getLiveMatch } from "@/lib/api/liveMatches";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const live = await getLiveMatch(id);
    return NextResponse.json(live);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 200 });
  }
}
