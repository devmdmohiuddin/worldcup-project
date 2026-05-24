import { NextResponse } from "next/server";
import { getHighlightsForMatch } from "@/lib/api/highlights";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const highlights = await getHighlightsForMatch(id);
    return NextResponse.json({ highlights });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ highlights: [], error: message }, { status: 200 });
  }
}
