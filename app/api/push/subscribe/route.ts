import { NextResponse } from "next/server";
import { getPushStore, PUSH_TOPICS, type PushTopic } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IncomingSubscription {
  clientId?: string;
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
  topics?: string[];
  favoriteTeamSlot?: string;
  locale?: string;
}

export async function POST(request: Request) {
  let body: IncomingSubscription;
  try {
    body = (await request.json()) as IncomingSubscription;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth || !body.clientId) {
    return NextResponse.json(
      { error: "endpoint, keys.p256dh, keys.auth, and clientId are required" },
      { status: 400 },
    );
  }

  const topics: PushTopic[] = (body.topics ?? []).filter((t): t is PushTopic =>
    PUSH_TOPICS.includes(t as PushTopic),
  );

  const now = new Date().toISOString();
  await getPushStore().upsert({
    clientId: body.clientId,
    endpoint: body.endpoint,
    keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
    topics,
    favoriteTeamSlot: body.favoriteTeamSlot,
    locale: body.locale ?? "en",
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true });
}
