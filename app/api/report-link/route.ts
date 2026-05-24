import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ReportPayload {
  matchId?: unknown;
  country?: unknown;
  broadcaster?: unknown;
  reason?: unknown;
}

function isString(x: unknown, maxLen: number): x is string {
  return typeof x === "string" && x.length > 0 && x.length <= maxLen;
}

export async function POST(request: Request) {
  let body: ReportPayload;
  try {
    body = (await request.json()) as ReportPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (
    !isString(body.matchId, 32) ||
    !isString(body.country, 4) ||
    !isString(body.broadcaster, 120)
  ) {
    return NextResponse.json({ ok: false, error: "invalid-payload" }, { status: 400 });
  }

  const reason = isString(body.reason, 280) ? body.reason : null;

  console.log("[report-link]", {
    matchId: body.matchId,
    country: body.country,
    broadcaster: body.broadcaster,
    reason,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
