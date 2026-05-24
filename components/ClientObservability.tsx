"use client";

import { useEffect } from "react";
import { installGlobalErrorHandlers, logClientError } from "@/lib/observability";

/**
 * Mount-once helper that wires the global error/rejection listeners and
 * reports first-load Web Vitals to Plausible (when available). Kept tiny so
 * it doesn't bloat the critical path.
 */
export function ClientObservability() {
  useEffect(() => {
    installGlobalErrorHandlers();

    if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") return;

    const w = window as Window & {
      plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
    };
    const send = (name: string, value: number, rating?: string) => {
      try {
        w.plausible?.("WebVital", {
          props: { name, value: Math.round(value), rating: rating ?? "n/a" },
        });
      } catch (err) {
        logClientError(err, { scope: "web-vitals" });
      }
    };

    // Largest Contentful Paint
    try {
      const lcp = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number };
        if (last) send("LCP", last.startTime || last.renderTime || 0);
      });
      lcp.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* not supported */
    }

    // Cumulative Layout Shift
    try {
      let cls = 0;
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!e.hadRecentInput) cls += e.value ?? 0;
        }
      });
      obs.observe({ type: "layout-shift", buffered: true });
      addEventListener(
        "visibilitychange",
        () => {
          if (document.visibilityState === "hidden") send("CLS", cls * 1000);
        },
        { once: true },
      );
    } catch {
      /* not supported */
    }
  }, []);

  return null;
}
