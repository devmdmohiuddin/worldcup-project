import { NextResponse } from "next/server";
import { getPrayerTimes } from "@/lib/prayer";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const date = searchParams.get("date") ?? undefined;
  const method = searchParams.get("method") ? Number(searchParams.get("method")) : undefined;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng query params are required" }, { status: 400 });
  }

  const times = await getPrayerTimes({ latitude: lat, longitude: lng, date, method });
  if (!times) {
    return NextResponse.json({ error: "Could not fetch prayer times" }, { status: 502 });
  }

  return NextResponse.json(times);
}
