import { NextResponse } from "next/server";
import { getPublicVapidKey } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ publicKey: getPublicVapidKey() });
}
