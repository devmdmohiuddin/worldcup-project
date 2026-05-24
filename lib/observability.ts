/**
 * Lightweight observability layer.
 *
 * Goal: capture client-side errors and page-load metrics without shipping a
 * heavy SDK (Sentry browser is ~70 KB gzipped). When a Sentry DSN is provided
 * via NEXT_PUBLIC_SENTRY_DSN we POST to its `/api/<projectId>/store/` envelope
 * endpoint directly; otherwise we fall back to our own `/api/log` route so the
 * data still lands somewhere the server-side logger can pick up.
 *
 * No PII is collected — only the error message, stack, URL, user agent, and a
 * coarse navigation timestamp.
 */

interface LogContext {
  scope?: string;
  [key: string]: unknown;
}

const isBrowser = typeof window !== "undefined";
const SENTRY_DSN =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SENTRY_DSN || "" : "";

const seen = new Set<string>();

function dedupeKey(error: Error, ctx: LogContext): string {
  return `${ctx.scope ?? ""}::${error.name}::${error.message}`;
}

function safeStack(stack: string | undefined, max = 2_000): string | undefined {
  if (!stack) return undefined;
  return stack.length > max ? stack.slice(0, max) + "…" : stack;
}

function postFallback(payload: unknown) {
  if (!isBrowser) return;
  try {
    void fetch("/api/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

function postSentry(error: Error, ctx: LogContext) {
  if (!SENTRY_DSN || !isBrowser) return false;
  try {
    const url = new URL(SENTRY_DSN);
    const projectId = url.pathname.replace(/^\/+/, "");
    const publicKey = url.username;
    if (!projectId || !publicKey) return false;

    const endpoint = `${url.protocol}//${url.host}/api/${projectId}/store/?sentry_key=${publicKey}&sentry_version=7`;
    const body = {
      message: error.message,
      level: "error",
      platform: "javascript",
      timestamp: Date.now() / 1000,
      tags: { scope: ctx.scope ?? "client" },
      extra: ctx,
      exception: {
        values: [{ type: error.name, value: error.message, stacktrace: { frames: [] } }],
      },
      request: { url: window.location.href, headers: { "User-Agent": navigator.userAgent } },
    };
    void fetch(endpoint, {
      method: "POST",
      mode: "cors",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export function logClientError(error: unknown, context: LogContext = {}): void {
  const err = error instanceof Error ? error : new Error(String(error));
  const key = dedupeKey(err, context);
  if (seen.has(key)) return;
  seen.add(key);

  const payload = {
    kind: "client-error",
    payload: {
      message: err.message,
      name: err.name,
      stack: safeStack(err.stack),
      context,
      url: isBrowser ? window.location.href : null,
      userAgent: isBrowser ? navigator.userAgent : null,
      at: new Date().toISOString(),
    },
  };

  if (typeof console !== "undefined") {
    console.error("[FootballClean]", err, context);
  }

  const sentry = postSentry(err, context);
  if (!sentry) postFallback(payload);
}

/**
 * Hook up global handlers once per page load so stray errors and rejected
 * promises also reach the logger. Safe to call multiple times — repeated
 * registrations are deduped via a window-level flag.
 */
export function installGlobalErrorHandlers(): void {
  if (!isBrowser) return;
  const w = window as Window & { __fcErrorHandlers?: boolean };
  if (w.__fcErrorHandlers) return;
  w.__fcErrorHandlers = true;

  window.addEventListener("error", (event) => {
    logClientError(event.error ?? new Error(event.message), { scope: "window.onerror" });
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    logClientError(reason, { scope: "unhandledrejection" });
  });
}
