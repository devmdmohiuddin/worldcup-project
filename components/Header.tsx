import Link from "next/link";
import { CountrySelect } from "./CountrySelect";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-pitch-600 text-base font-bold text-white"
          >
            ⚽
          </span>
          <span className="text-base font-semibold tracking-tight">
            Football<span className="text-pitch-400">Clean</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/" className="rounded-md px-2 py-1 hover:text-pitch-400">
              Schedule
            </Link>
            <Link
              href="/standings"
              className="hidden rounded-md px-2 py-1 text-ink-300 hover:text-pitch-400 sm:inline"
            >
              Standings
            </Link>
            <Link
              href="/bracket"
              className="hidden rounded-md px-2 py-1 text-ink-300 hover:text-pitch-400 sm:inline"
            >
              Bracket
            </Link>
            <Link
              href="/highlights"
              className="hidden rounded-md px-2 py-1 text-ink-300 hover:text-pitch-400 sm:inline"
            >
              Highlights
            </Link>
          </nav>
          <CountrySelect variant="compact" />
        </div>
      </div>
    </header>
  );
}
