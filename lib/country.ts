export const COUNTRY_COOKIE = "fc_country";
export const COUNTRY_CHANGE_EVENT = "fc-country-change";

/**
 * Country code resolution priority for incoming requests:
 *   1. Override cookie (user manually selected)
 *   2. Vercel edge geo header (x-vercel-ip-country)
 *   3. Cloudflare header (cf-ipcountry) for non-Vercel deployments
 *   4. null — caller may default to DEFAULT_COUNTRY
 */
export function detectCountryFromHeaders(headers: Headers): string | null {
  const cookieHeader = headers.get("cookie") ?? "";
  const cookieCountry = parseCookie(cookieHeader, COUNTRY_COOKIE);
  if (cookieCountry) return cookieCountry.toUpperCase();

  const vercel = headers.get("x-vercel-ip-country");
  if (vercel) return vercel.toUpperCase();

  const cloudflare = headers.get("cf-ipcountry");
  if (cloudflare) return cloudflare.toUpperCase();

  return null;
}

function parseCookie(cookieHeader: string, name: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/** Read the override cookie in the browser. */
export function readCountryCookie(): string | null {
  if (typeof document === "undefined") return null;
  return parseCookie(document.cookie, COUNTRY_COOKIE);
}

/** Persist the user's country choice for 180 days and notify listeners. */
export function writeCountryCookie(code: string): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${COUNTRY_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(COUNTRY_CHANGE_EVENT, { detail: code }));
}
