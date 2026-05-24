import { NextResponse } from "next/server";
import { detectCountryFromHeaders } from "@/lib/country";
import { isSupportedCountry } from "@/lib/broadcasters";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const detected = detectCountryFromHeaders(request.headers);
  const supported = detected && isSupportedCountry(detected);
  return NextResponse.json({
    code: detected,
    supported: Boolean(supported),
  });
}
