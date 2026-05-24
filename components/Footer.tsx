const TELEGRAM_BOT_URL = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || "https://t.me/footballclean_bot";

export function Footer() {
  return (
    <footer className="border-t border-ink-800/80 py-6 text-center text-xs text-ink-400">
      <div className="container-page space-y-2">
        <p>FootballClean · The clean way to watch the FIFA World Cup 2026.</p>
        <p className="text-ink-500">
          We don&apos;t host streams. We point you to legal broadcasters only.
        </p>
        <p>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-ink-700 px-3 py-1 text-ink-200 hover:border-pitch-500 hover:text-pitch-400"
          >
            <span aria-hidden>🤖</span> Get daily updates on Telegram
          </a>
        </p>
      </div>
    </footer>
  );
}
