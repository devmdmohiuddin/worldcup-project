"use client";

import { useEffect, useState } from "react";
import { COUNTRY_CHANGE_EVENT, readCountryCookie, writeCountryCookie } from "@/lib/country";
import { listSupportedCountries } from "@/lib/broadcasters";
import { track } from "@/lib/analytics";

interface Props {
  /** Visible label, defaults to "Watching from". */
  label?: string;
  /** Compact (header) vs full-width (widget) styling. */
  variant?: "compact" | "full";
  /** Initial country code from cookie or geo header (server-rendered). */
  initialCode?: string | null;
}

const COUNTRIES = listSupportedCountries();

export function CountrySelect({
  label = "Watching from",
  variant = "compact",
  initialCode = null,
}: Props) {
  const [code, setCode] = useState<string | null>(initialCode);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cookie = readCountryCookie();
    if (cookie) {
      setCode(cookie.toUpperCase());
      setReady(true);
      return;
    }
    if (initialCode) {
      setReady(true);
      return;
    }
    fetch("/api/country")
      .then((r) => r.json())
      .then((data: { code: string | null }) => {
        if (data.code) setCode(data.code.toUpperCase());
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [initialCode]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setCode(detail.toUpperCase());
    };
    window.addEventListener(COUNTRY_CHANGE_EVENT, handler);
    return () => window.removeEventListener(COUNTRY_CHANGE_EVENT, handler);
  }, []);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setCode(next);
    writeCountryCookie(next);
    track("Country Change", { country: next });
  }

  const baseSelect =
    "rounded-md border border-ink-700 bg-ink-900 px-2 py-1 text-sm text-ink-100 focus:border-pitch-500 focus:outline-none";

  if (variant === "compact") {
    return (
      <label className="flex items-center gap-1 text-xs text-ink-400" title={label}>
        <span aria-hidden>🌎</span>
        <select
          aria-label={label}
          value={code ?? ""}
          onChange={onChange}
          disabled={!ready}
          className={baseSelect}
        >
          {code === null && <option value="">—</option>}
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="text-ink-300 flex items-center gap-2 text-sm">
      <span>{label}:</span>
      <select
        aria-label={label}
        value={code ?? ""}
        onChange={onChange}
        disabled={!ready}
        className={baseSelect}
      >
        {code === null && <option value="">Select a country…</option>}
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
