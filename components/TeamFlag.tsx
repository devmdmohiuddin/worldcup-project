/**
 * Render a real flag image for a national team — sourced from flagcdn.com.
 * - Falls back to a neutral placeholder when the team is still TBD (cc null).
 * - Uses lowercase ISO 3166-1 alpha-2 codes in the URL.
 * - Async-decoding + lazy-loading keeps the schedule list cheap to render.
 */

interface Props {
  /** ISO 3166-1 alpha-2 country code (lowercase preferred); null when unknown. */
  cc: string | null;
  /** Visual size; sm = 20×14, md = 28×20, lg = 56×40. */
  size?: "sm" | "md" | "lg";
  /** Accessible alt text — usually the team name. */
  alt?: string;
}

const SIZES = {
  sm: { class: "h-3.5 w-5 text-[10px]", width: 32 },
  md: { class: "h-5 w-7 text-xs", width: 80 },
  lg: { class: "h-10 w-14 text-base sm:h-12 sm:w-16", width: 160 },
} as const;

export function TeamFlag({ cc, size = "md", alt }: Props) {
  const cfg = SIZES[size];
  const base = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-ink-700 bg-ink-800 leading-none ${cfg.class}`;

  if (!cc) {
    return (
      <span
        aria-hidden
        className={`${base} bg-gradient-to-br from-ink-700 to-ink-800 text-ink-500`}
        title={alt ?? "Team to be determined"}
      >
        <svg viewBox="0 0 24 24" className="h-3/4 w-3/4" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" strokeWidth={1.2} />
          <path d="M12 3a13 13 0 0 1 0 18" strokeWidth={1.2} />
          <path d="M12 3a13 13 0 0 0 0 18" strokeWidth={1.2} />
        </svg>
      </span>
    );
  }

  const code = cc.toLowerCase();
  return (
    <span aria-hidden className={base}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w${cfg.width}/${code}.png`}
        srcSet={`https://flagcdn.com/w${cfg.width * 2}/${code}.png 2x`}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </span>
  );
}
