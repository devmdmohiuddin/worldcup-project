/** Tiny class-name joiner. Drops falsy values and dedupes whitespace. */
export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
