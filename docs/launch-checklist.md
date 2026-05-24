# FootballClean Launch Checklist

Last reviewed: Sprint 8 (June 2026). Use this list to gate the public launch
on **11 June 2026** — the day the World Cup kicks off.

## 1. Performance (Lighthouse target ≥ 95)

- [ ] Run Lighthouse against `/`, `/standings`, `/bracket`, `/highlights`, `/match/m1`
      on both Mobile and Desktop profiles.
- [ ] LCP < 2.5 s on a simulated 4G connection.
- [ ] CLS < 0.1 across all pages (Web Vitals reported back to Plausible).
- [ ] Total blocking time < 200 ms.
- [ ] Inspect bundle: `pnpm next build && pnpm next analyze` (or `--profile`) —
      no single chunk > 200 KB gzipped on first load.

## 2. Real-device smoke test

| Device                | OS / Browser                | Status |
| --------------------- | --------------------------- | ------ |
| Cheap Android (1 GB)  | Chrome stable               | ⏳     |
| Mid Android           | Chrome + Firefox            | ⏳     |
| iPhone SE (gen 2)     | Safari (iOS 17)             | ⏳     |
| iPhone 15             | Safari + Chrome             | ⏳     |
| Desktop Mac           | Safari, Chrome, Firefox     | ⏳     |
| Desktop Windows       | Edge, Chrome, Firefox       | ⏳     |
| Linux                 | Chromium, Firefox           | ⏳     |

For each device: open schedule, change country, change language to Arabic
(verify RTL), play one highlight, install the PWA, and trigger one push
notification from `/notifications`.

## 3. Network conditions

- [ ] Site is usable on simulated 2G (DevTools → Throttling → Slow 3G).
- [ ] Schedule renders within 5 s on 2G — skeletons fill the gap.
- [ ] All API routes survive a 10 s timeout without throwing.
- [ ] Service worker serves `/` from cache when offline (manual airplane-mode
      test).

## 4. Accessibility (WCAG 2.1 AA)

- [ ] axe DevTools shows 0 serious issues on every public page.
- [ ] Keyboard-only walkthrough of every page — focus is visible at every step.
- [ ] Skip-link reaches `<main id="main-content">` from the first Tab press.
- [ ] All interactive elements have an accessible name (`aria-label` or text).
- [ ] Color contrast checked with browser dev tools — text ≥ 4.5:1, large
      text ≥ 3:1.
- [ ] Screen-reader pass on macOS VoiceOver and Android TalkBack on the
      schedule and a match page.
- [ ] `prefers-reduced-motion` disables the live ping animation.

See [`a11y.md`](./a11y.md) for the detailed audit log.

## 5. Internationalisation

- [ ] All 5 locales (English, Bengali, Urdu, Arabic, Hindi) render without
      overflow on a 320 px viewport.
- [ ] Arabic & Urdu render right-to-left end-to-end (header, filters, match
      card).
- [ ] No untranslated `t("...")` keys appear in the DOM (greppable check).

## 6. Halal & policy

- [ ] No gambling or betting partner ever appears in the broadcaster list.
- [ ] No alcohol / riba / haram product anywhere in the UI.
- [ ] All highlight videos come from the curated official channel list.
- [ ] Footer reaffirms "no streams hosted here".

## 7. Operations

- [ ] Error logging verified: trigger a client error, confirm it lands in
      Sentry (or `/api/log` console).
- [ ] Plausible verified: change country → "Country Change" event visible.
- [ ] Telegram bot online; `/today` returns the day's matches.
- [ ] Chrome extension reviewed; submission to Web Store complete.
- [ ] DNS, SSL, and `NEXT_PUBLIC_SITE_URL` all point at the production host.
- [ ] `robots.txt` and `sitemap.xml` reachable; Google Search Console
      verified.

## 8. Post-launch (within 24 h)

- [ ] Watch Plausible for traffic spikes and JS-error rate.
- [ ] Watch the first three live matches — confirm scores tick on time, no
      empty states, no broken cards.
- [ ] Confirm prayer-time widget resolves correctly for users in Dhaka,
      Karachi, Riyadh, Jakarta, and London.
