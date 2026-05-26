"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logClientError } from "@/lib/observability";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logClientError(error, { scope: "route" });
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
      className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12 text-center"
    >
      <span aria-hidden className="text-5xl">
        ⚠️
      </span>
      <h1 className="text-2xl font-bold tracking-tight">Something went off-side.</h1>
      <p className="max-w-md text-sm text-ink-400">
        An unexpected error happened while loading this page. The team has been notified — try
        again, or head back to fixtures.
      </p>
      {error.digest && (
        <p className="text-xs text-ink-500">
          Reference: <code className="rounded bg-ink-800 px-1">{error.digest}</code>
        </p>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn">
          Back to fixtures
        </Link>
      </div>
    </main>
  );
}
