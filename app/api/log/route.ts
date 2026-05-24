import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LogPayload {
  kind?: string;
  payload?: unknown;
}

const recent = new Map<string, number>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

function rateLimitKey(req: Request): string {
  // Prefer the platform-supplied client IP header; fall back to UA + Accept
  // so behaviour is deterministic in tests.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("user-agent") || "anonymous";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  for (const [k, t] of recent) if (t < cutoff) recent.delete(k);
  let count = 0;
  for (const [k] of recent) if (k.startsWith(`${key}::`)) count++;
  if (count >= MAX_PER_WINDOW) return true;
  recent.set(`${key}::${now}-${Math.random()}`, now);
  return false;
}

export async function POST(request: Request) {
  if (isRateLimited(rateLimitKey(request))) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  let body: LogPayload;
  try {
    body = (await request.json()) as LogPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const kind = typeof body.kind === "string" ? body.kind.slice(0, 64) : "unknown";
  // Cheap server-side sink: structured console line. In production this is
  // picked up by Vercel/Render log drains; the format mirrors what a Sentry
  // breadcrumb would carry so a future migration is trivial.
  console.warn("[fc-log]", JSON.stringify({ kind, payload: body.payload }));

  return NextResponse.json({ ok: true });
}
