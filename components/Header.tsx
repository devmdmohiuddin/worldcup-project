import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between">
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
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/" className="rounded-md px-2 py-1 hover:text-pitch-400">
            Schedule
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-2 py-1 text-ink-400 hover:text-pitch-400"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
