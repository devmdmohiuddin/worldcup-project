"use client";

import { useEffect, useMemo, useState } from "react";
import type { Broadcaster, CountryBroadcasters } from "@/lib/types";
import {
  getBroadcastersForCountry,
  getFallbackBroadcasters,
  resolveBroadcasterUrl,
  sortBroadcasters,
} from "@/lib/broadcasters";
import { COUNTRY_CHANGE_EVENT, readCountryCookie } from "@/lib/country";
import { CountrySelect } from "./CountrySelect";

interface Props {
  matchId: string;
}

export function WhereToWatch({ matchId }: Props) {
  const [code, setCode] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const cookie = readCountryCookie();
    if (cookie) {
      setCode(cookie.toUpperCase());
      setResolved(true);
      return;
    }
    fetch("/api/country")
      .then((r) => r.json())
      .then((d: { code: string | null }) => setCode(d.code ? d.code.toUpperCase() : null))
      .catch(() => {})
      .finally(() => setResolved(true));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setCode(detail.toUpperCase());
    };
    window.addEventListener(COUNTRY_CHANGE_EVENT, handler);
    return () => window.removeEventListener(COUNTRY_CHANGE_EVENT, handler);
  }, []);

  const country = useMemo<CountryBroadcasters | null>(
    () => getBroadcastersForCountry(code),
    [code],
  );
  const broadcasters = useMemo(
    () => sortBroadcasters(country?.broadcasters ?? getFallbackBroadcasters()),
    [country],
  );

  const free = broadcasters.filter((b) => b.tier === "free");
  const paid = broadcasters.filter((b) => b.tier === "paid");

  return (
    <section className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/60">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-800 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-200">
            Where to watch — legally
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">
            {country ? (
              <>
                Showing options for{" "}
                <span className="text-ink-300">
                  {country.flag} {country.name}
                </span>
              </>
            ) : resolved ? (
              "We don't have listings for your country yet — showing global options."
            ) : (
              "Detecting your country…"
            )}
          </p>
        </div>
        <CountrySelect variant="compact" initialCode={code} />
      </header>

      <div className="space-y-5 px-5 py-4">
        {free.length > 0 && (
          <BroadcasterGroup
            title="Free options"
            tone="pitch"
            items={free}
            matchId={matchId}
            country={code ?? ""}
          />
        )}
        {paid.length > 0 && (
          <BroadcasterGroup
            title="Paid options"
            tone="ink"
            items={paid}
            matchId={matchId}
            country={code ?? ""}
          />
        )}
        {broadcasters.length === 0 && (
          <p className="text-sm text-ink-400">
            No broadcaster information yet. Check FIFA+ for your region.
          </p>
        )}
      </div>

      <footer className="border-t border-ink-800 px-5 py-3 text-xs text-ink-500">
        Listings curated for clean viewing — no betting partners. Some links may be affiliate links
        that help fund the site at no cost to you.
      </footer>
    </section>
  );
}

function BroadcasterGroup({
  title,
  tone,
  items,
  matchId,
  country,
}: {
  title: string;
  tone: "pitch" | "ink";
  items: Broadcaster[];
  matchId: string;
  country: string;
}) {
  const dotClass = tone === "pitch" ? "bg-pitch-500" : "bg-ink-500";
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
        <span className={`inline-block h-2 w-2 rounded-full ${dotClass}`} aria-hidden />
        {title}
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((b) => (
          <BroadcasterCard
            key={`${b.name}-${b.type}`}
            broadcaster={b}
            matchId={matchId}
            country={country}
          />
        ))}
      </ul>
    </div>
  );
}

function BroadcasterCard({
  broadcaster,
  matchId,
  country,
}: {
  broadcaster: Broadcaster;
  matchId: string;
  country: string;
}) {
  const url = resolveBroadcasterUrl(broadcaster);
  return (
    <li className="flex items-start justify-between gap-2 rounded-xl border border-ink-800 bg-ink-950/60 p-3">
      <div className="min-w-0 flex-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block truncate text-sm font-medium text-ink-100 hover:text-pitch-400"
          title={broadcaster.name}
        >
          {broadcaster.name}
        </a>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-500">
          <span className="rounded bg-ink-800 px-1.5 py-0.5">{broadcaster.type}</span>
          {broadcaster.languages.map((l) => (
            <span key={l} className="rounded bg-ink-800 px-1.5 py-0.5">
              {l}
            </span>
          ))}
        </div>
        {broadcaster.note && <p className="mt-1.5 text-xs text-ink-400">{broadcaster.note}</p>}
      </div>
      <ReportLinkButton matchId={matchId} country={country} broadcaster={broadcaster.name} />
    </li>
  );
}

function ReportLinkButton({
  matchId,
  country,
  broadcaster,
}: {
  matchId: string;
  country: string;
  broadcaster: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function report() {
    if (status === "sending" || status === "sent") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/report-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          country: country || "??",
          broadcaster,
          reason: "broken-or-wrong",
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const label =
    status === "sent"
      ? "Thanks"
      : status === "error"
        ? "Retry"
        : status === "sending"
          ? "…"
          : "Report";
  return (
    <button
      type="button"
      onClick={report}
      disabled={status === "sending" || status === "sent"}
      className="shrink-0 rounded-md border border-ink-700 px-2 py-1 text-[10px] uppercase tracking-wider text-ink-400 hover:border-pitch-500 hover:text-pitch-400 disabled:opacity-60"
      title="Report a broken or wrong link"
    >
      {label}
    </button>
  );
}
