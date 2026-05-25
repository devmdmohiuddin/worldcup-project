"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Root-layout crash — observability module may be unavailable, so log
    // defensively. The browser console catches everything we miss.
    try {
      const payload = {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        url: typeof window !== "undefined" ? window.location.href : null,
        at: new Date().toISOString(),
      };
      void fetch("/api/log", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "global-error", payload }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* swallow — we're already in an error state */
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#020617",
          color: "#f1f5f9",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <div aria-hidden style={{ fontSize: "3rem" }}>
            ⚠️
          </div>
          <h1 style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 700 }}>
            MatchHub hit a snag.
          </h1>
          <p style={{ marginTop: "0.5rem", color: "#94a3b8", fontSize: "0.875rem" }}>
            Something broke at the application root. Refresh to recover.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
