/**
 * Thin wrapper around Plausible's window.plausible function.
 *
 * Plausible loads its script defer-attribute in <head>, so callers can fire
 * events at any time after first paint. When the script is absent (e.g. in
 * local dev with no NEXT_PUBLIC_PLAUSIBLE_DOMAIN) calls become no-ops.
 *
 * Events should be human-readable — Plausible's dashboard groups by event name.
 */

type Props = Record<string, string | number | boolean>;

type PlausibleFn = (event: string, opts?: { props?: Props }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function track(event: string, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* never let analytics throw into user code */
  }
}
