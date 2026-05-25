# Observability

MatchHub intentionally avoids heavyweight SDKs (Sentry browser, Datadog
RUM, etc.) so the critical-path bundle stays under control. Instead we use
two lightweight layers:

## 1. Plausible Analytics

Plausible is cookie-free and GDPR-friendly. We embed it via a single
`<script defer>` tag in the root layout, only when
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.

**Events** (fired through `lib/analytics.ts`):

| Event           | Props              | Where it fires                  |
| --------------- | ------------------ | ------------------------------- |
| `Locale Change` | `locale`           | `LanguageSelect`                |
| `Country Change`| `country`          | `CountrySelect`                 |
| `WebVital`      | `name, value, rating` | `ClientObservability`        |

Add a new event by calling `track("Event Name", { prop: value })` from any
client component.

## 2. Error logging

`lib/observability.ts` exposes `logClientError(err, ctx)` and
`installGlobalErrorHandlers()`. The pipeline is:

1. Caller invokes `logClientError(err, { scope: "..." })`.
2. If `NEXT_PUBLIC_SENTRY_DSN` is set, the helper POSTs directly to Sentry's
   `/api/<projectId>/store/` envelope endpoint — no SDK ships to the client.
3. Otherwise the helper POSTs to our own `/api/log` route, which structures
   the payload and writes a `console.warn` line. On Vercel / Render that
   feeds log drains; locally it shows in the dev terminal.

Sources wired up:

- `app/error.tsx` — React route-level errors.
- `app/global-error.tsx` — root-layout crashes (uses raw `fetch` so it can
  recover even without the observability module loaded).
- `ClientObservability` — `window.onerror` and `unhandledrejection` listeners.

### Deduplication & rate-limit

- `logClientError` dedupes within a session by `(scope, name, message)`.
- `/api/log` rate-limits to 30 events / minute / client (cheap in-memory
  counter; switch to Upstash if abuse appears in production).

### Stack trim

Stacks are truncated to 2 000 chars before send to keep request bodies tight.

## When to escalate to a full SDK

Migrate to the real Sentry browser SDK if any of these become true:

- We need source-mapped stacks in production.
- We want session replays.
- We start ingesting > 5 000 events/day and need server-side sampling.

Until then this lightweight setup catches the common failures (network
errors, malformed JSON, React render errors) without the bundle cost.
