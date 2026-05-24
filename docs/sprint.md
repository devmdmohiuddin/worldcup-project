# 🏃 FootballClean — Sprint Tracker

> Track every feature, every task, every sprint. Update statuses as you complete work.

## 📊 Sprint Overview

| Sprint | Dates | Focus | Status |
|---|---|---|---|
| Sprint 1 | May 24 – May 25 | Project Foundation & Schedule | 🟡 In Progress |
| Sprint 2 | May 26 – May 27 | Live Scores Integration | ⏳ Not Started |
| Sprint 3 | May 28 – May 29 | Stream Finder ("Where to Watch") | ⏳ Not Started |
| Sprint 4 | May 30 | Highlights Hub | ⏳ Not Started |
| Sprint 5 | May 31 – Jun 1 | Browser Extension | ⏳ Not Started |
| Sprint 6 | Jun 2 | Telegram Bot | ⏳ Not Started |
| Sprint 7 | Jun 3 – Jun 4 | Prayer Times & Notifications | ⏳ Not Started |
| Sprint 8 | Jun 5 | Testing & Polish | ⏳ Not Started |
| Sprint 9 | Jun 6 | Pre-Launch Setup | ⏳ Not Started |
| 🚀 Launch | **Jun 11, 2026** | **World Cup Opening Day** | 🎯 Target |

**Status Legend:** ⏳ Not Started · 🟡 In Progress · ✅ Done · 🔴 Blocked

---

## 🏁 Sprint 1 — Project Foundation & Schedule
**Dates:** May 24 – May 25, 2026 · **Status:** 🟡 In Progress (code complete, deploy pending)

### Goal
Set up the full project skeleton and build the static match schedule page.

### Tasks
- [x] Initialize Next.js 15 project with TypeScript
- [x] Set up Tailwind CSS + dark mode default
- [x] Configure ESLint, Prettier, .gitignore
- [x] Create folder structure: `/app`, `/components`, `/lib`, `/public`
- [ ] Deploy "Hello World" to Vercel _(owner: you — run `vercel` after `pnpm install`)_
- [ ] Buy domain (e.g. footballclean.com) _(owner: you)_
- [ ] Connect domain to Vercel _(owner: you)_
- [x] Add World Cup 2026 fixtures data (JSON seed) — group stage (72 matches); knockouts deferred until draw seeds resolve in Sprint 2
- [x] Build match schedule page (all 72 group-stage matches; knockouts to come)
- [x] Add filters: by date, by team, by group, by stage
- [x] Implement auto timezone conversion for user
- [x] Build responsive mobile-first layout
- [x] Add PWA manifest + service worker (basic)

### Deliverable
A live URL showing the full World Cup schedule in the user's timezone, mobile-friendly.

### Local verification
```
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build (passes)
pnpm lint     # passes
pnpm typecheck
```

### Notes
- Team names in `data/teams.json` are placeholders (A1–L4) outside the three hosts. Update once the FIFA draw is finalized — no code changes needed, the resolver picks up the JSON.
- Group stage venue/date layout in `lib/fixtures.ts` is a balanced approximation; re-check against the published FIFA chart before launch.

---

## ⚽ Sprint 2 — Live Scores Integration
**Dates:** May 26 – May 27, 2026 · **Status:** ⏳ Not Started

### Goal
Wire up real-time live scores from football-data.org API.

### Tasks
- [ ] Sign up for football-data.org API key (free tier)
- [ ] Create `/lib/api/footballData.ts` wrapper
- [ ] Set up Upstash Redis for caching API responses
- [ ] Build live score ticker component (top of homepage)
- [ ] Build individual match detail page
- [ ] Show: live score, minute, goal scorers, cards, stats
- [ ] Add auto-refresh (every 30s during live matches)
- [ ] Build group standings page (live updating)
- [ ] Build knockout bracket visualizer
- [ ] Add "LIVE" badge with pulsing animation
- [ ] Handle API rate limits gracefully (cache + fallback)

### Deliverable
Real-time scores visible on homepage and each match page, updating automatically.

---

## 📍 Sprint 3 — Stream Finder ("Where to Watch")
**Dates:** May 28 – May 29, 2026 · **Status:** ⏳ Not Started

### Goal
The killer feature: tell users exactly where to watch each match LEGALLY in their country.

### Tasks
- [ ] Research free legal broadcasters per country (50+ countries)
- [ ] Build broadcaster database (JSON): country → broadcaster → free/paid
- [ ] Auto-detect user country (IP geolocation via Vercel)
- [ ] Add "Change country" dropdown for manual selection
- [ ] Build "Where to Watch" widget on every match page
- [ ] Show free options first (BBC, Toffee, ARD, TF1, CBC Gem, etc.)
- [ ] Show paid options second (DAZN, ESPN+, Fox)
- [ ] One-click external link to official broadcaster
- [ ] Add affiliate links where available (DAZN, ESPN+, VPN)
- [ ] Add "Report broken link" feature for user updates

### Deliverable
Every match page shows exactly where to watch legally, filtered by user's country.

---

## 🎬 Sprint 4 — Highlights Hub
**Dates:** May 30, 2026 · **Status:** ⏳ Not Started

### Goal
Embed official YouTube highlights from FIFA/broadcasters for every completed match.

### Tasks
- [ ] Set up YouTube Data API v3 key
- [ ] Identify official channels (FIFA, FOX Soccer, BBC Sport, DAZN)
- [ ] Build automated fetcher: post-match, search for highlight video
- [ ] Build highlights page (all videos, filterable)
- [ ] Add highlights section on each match page (post full-time)
- [ ] Lazy-load YouTube iframes (performance)
- [ ] Add filters: by team, by player, by date
- [ ] "Best goals of tournament" curated section

### Deliverable
Users can watch official highlights on the site immediately after each match ends.

---

## 🧩 Sprint 5 — Browser Extension
**Dates:** May 31 – Jun 1, 2026 · **Status:** ⏳ Not Started

### Goal
Build the "Clean Stream" Chrome extension to block ads on streaming sites.

### Tasks
- [ ] Set up Chrome extension project (Manifest V3)
- [ ] Build content script: detect streaming sites
- [ ] Block popup ads (window.open overrides)
- [ ] Hide fake play buttons (CSS heuristics)
- [ ] Remove malicious overlays
- [ ] Block adult/gambling ad domains (filter list)
- [ ] Build extension popup UI (toggle, stats, settings)
- [ ] Add "blocked count" badge on icon
- [ ] Pay Chrome Web Store fee ($5)
- [ ] Submit extension for review
- [ ] Write privacy policy + listing description
- [ ] Add free vs Premium tier logic (Premium = future)

### Deliverable
Extension live on Chrome Web Store, blocking popups and fake buttons on streaming sites.

---

## 🤖 Sprint 6 — Telegram Bot
**Dates:** Jun 2, 2026 · **Status:** ⏳ Not Started

### Goal
Launch a Telegram bot for daily match updates and live alerts.

### Tasks
- [ ] Create bot via @BotFather
- [ ] Set up Node.js + Telegraf project
- [ ] Deploy to Railway (free tier)
- [ ] Implement `/start` and `/help` commands
- [ ] Implement `/today` — today's matches + where to watch
- [ ] Implement `/standings` — group tables
- [ ] Implement `/team <name>` — favorite team setup
- [ ] Set up cron job: daily 9am message
- [ ] Set up live goal alerts (poll API during live matches)
- [ ] Add language selector (EN, BN, UR, AR, HI)
- [ ] Promote bot link on website

### Deliverable
Working Telegram bot with daily updates and live goal alerts.

---

## 🕌 Sprint 7 — Prayer Times & Notifications
**Dates:** Jun 3 – Jun 4, 2026 · **Status:** ⏳ Not Started

### Goal
Add the unique Muslim-friendly features that set us apart from all competitors.

### Tasks
- [ ] Integrate Aladhan prayer times API
- [ ] Detect user location for accurate prayer times
- [ ] Show prayer times widget on homepage
- [ ] Add prayer conflict badge on match cards ("⚠️ Maghrib at 6:45")
- [ ] Suggest "best matches without prayer conflict"
- [ ] Build notification preferences page
- [ ] Implement browser push notifications (web-push)
- [ ] Goal alerts for favorite team
- [ ] Match start reminders (15 min before)
- [ ] Prayer time reminders before/after match
- [ ] Add multi-language support (i18n setup): EN, BN, UR, AR, HI

### Deliverable
Prayer times integrated into every match page. Push notifications working. Site available in 5 languages.

---

## 🧪 Sprint 8 — Testing & Polish
**Dates:** Jun 5, 2026 · **Status:** ⏳ Not Started

### Goal
Find and fix every bug. Make it fast, beautiful, and ready for thousands of users.

### Tasks
- [ ] Lighthouse audit — target 95+ score
- [ ] Test on real phones (cheap Android, iPhone)
- [ ] Test on slow 2G/3G connection
- [ ] Cross-browser test (Chrome, Firefox, Safari, Edge)
- [ ] Fix all responsive breakpoints
- [ ] Add loading skeletons (no blank screens)
- [ ] Add error boundaries + fallback UI
- [ ] Verify all external links work
- [ ] Test PWA install flow
- [ ] Set up error logging (Sentry free tier)
- [ ] Set up analytics (Plausible)
- [ ] Write accessibility audit fixes (a11y)

### Deliverable
Fast, accessible, bug-free site ready for launch. Lighthouse 95+.

---

## 🚀 Sprint 9 — Pre-Launch Setup
**Dates:** Jun 6, 2026 · **Status:** ⏳ Not Started

### Goal
Marketing, SEO, monetization wiring, and final launch prep.

### Tasks
- [ ] Apply for Google AdSense
- [ ] Set up halal ad category filters
- [ ] Add affiliate links (DAZN, ESPN+, VPN)
- [ ] Write SEO meta tags for every page
- [ ] Submit sitemap to Google Search Console
- [ ] Create social media accounts (Twitter, Instagram, TikTok)
- [ ] Prepare 7 launch-day social media posts
- [ ] Write Reddit launch posts (r/soccer, r/worldcup)
- [ ] Prepare WhatsApp share message
- [ ] Add "Share" buttons on all pages
- [ ] Set up backup + monitoring
- [ ] Final security review

### Deliverable
Everything ready. Domain live. Ads approved. Social posts queued.

---

## 🎯 Launch Day — June 11, 2026

### Launch Tasks
- [ ] Final smoke test: all features working
- [ ] Post launch on Reddit (r/soccer, r/worldcup, r/bangladesh)
- [ ] Post on Twitter/X with hashtags
- [ ] Share in Facebook football groups
- [ ] Send to friends/family WhatsApp groups
- [ ] Submit to Product Hunt
- [ ] Monitor analytics in real-time
- [ ] Respond to user feedback fast

### Success Criteria for Launch Day
- ✅ Site stays up under load
- ✅ Live scores update in real-time
- ✅ At least 1,000 visitors
- ✅ At least 50 extension installs
- ✅ At least 20 Telegram bot users

---

## 📈 Post-Launch (Jun 11 – Jul 19, 2026)

### Daily Tasks During World Cup
- [ ] Monitor uptime and errors
- [ ] Respond to user feedback
- [ ] Post one social media update per match day
- [ ] Update broken stream links as users report
- [ ] Fix bugs as found
- [ ] Track earnings + analytics

### Weekly Reviews
- [ ] Week 1 retrospective (Jun 18)
- [ ] Week 2 retrospective (Jun 25)
- [ ] Week 3 retrospective (Jul 2)
- [ ] Week 4 retrospective (Jul 9)
- [ ] Final review (Jul 20 — day after final)

---

## 📝 Daily Update Template

Copy this for daily standups (use in commit messages too):

```
Date: YYYY-MM-DD
Sprint: X
Done: [list of completed tasks]
Doing: [in-progress tasks]
Blocked: [any blockers]
Next: [next 1-2 tasks]
```

---

## 🎉 Definition of Done

A sprint task is **DONE** when:
1. ✅ Code is written and works locally
2. ✅ Deployed to production (Vercel)
3. ✅ Tested on real mobile device
4. ✅ Committed and pushed to git
5. ✅ Checkbox above is checked
