# 🏃 MatchHub — Sprint Tracker

> Track every feature, every task, every sprint. Update statuses as you complete work.

## 📊 Sprint Overview

| Sprint | Dates | Focus | Status |
|---|---|---|---|
| Sprint 1 | May 24 – May 25 | Foundation, real fixtures, light/dark theme | ⏳ Not Started |
| Sprint 2 | May 26 – May 27 | Match cards with flags, interactive UI, schedule page | ⏳ Not Started |
| Sprint 3 | May 28 – May 29 | Live scores + match detail page + MOTM | ⏳ Not Started |
| Sprint 4 | May 30 – May 31 | Standings + bracket (beautiful & interactive) | ⏳ Not Started |
| Sprint 5 | Jun 1 – Jun 2 | Highlights hub (FIFA.com style, by year) | ⏳ Not Started |
| Sprint 6 | Jun 3 | Embedded live stream + "Watch on broadcaster" buttons | ⏳ Not Started |
| Sprint 7 | Jun 4 | Teams, players, news section | ⏳ Not Started |
| Sprint 8 | Jun 5 | Browser extension + Telegram bot | ⏳ Not Started |
| Sprint 9 | Jun 6 | i18n, PWA, polish, testing | ⏳ Not Started |
| 🚀 Launch | **Jun 11, 2026** | **World Cup Opening Day** | 🎯 Target |

**Status Legend:** ⏳ Not Started · 🟡 In Progress · ✅ Done · 🔴 Blocked

---

## 🏁 Sprint 1 — Foundation, Real Fixtures, Theme
**Dates:** May 24 – May 25, 2026 · **Status:** ⏳ Not Started

### Goal
Project skeleton + light/dark theme + ALL real World Cup 2026 fixtures as seed data.

### Tasks
- [ ] Initialize Next.js 15 project with TypeScript + App Router
- [ ] Set up Tailwind CSS + Framer Motion
- [ ] Configure ESLint, Prettier
- [ ] Folder structure: `/app`, `/components`, `/lib`, `/data`, `/public`, `/assets`
- [ ] Add SVG logo + favicon (from `/assets`)
- [ ] Implement **light mode default** + dark mode toggle (next-themes)
- [ ] Save theme preference in localStorage
- [ ] Set up base layout with header (logo + theme toggle + nav)
- [ ] **Seed `/data/fixtures.ts`** with ALL 104 real World Cup 2026 matches:
  - Real teams (Mexico, South Africa, Argentina, etc. — NOT "A2", "B1")
  - Real dates, kickoff times
  - Real stadiums + cities
  - Real groups (A-L) and rounds
- [ ] Seed `/data/teams.ts` with all 48 qualified nations (name, flag code, group)
- [ ] Deploy "Hello MatchHub" to Vercel
- [ ] Buy `matchhub.live` domain + connect to Vercel

### Deliverable
Live site at matchhub.live showing header (logo + theme toggle) with light/dark working.

---

## ⚽ Sprint 2 — Match Cards + Schedule
**Dates:** May 26 – May 27, 2026 · **Status:** ⏳ Not Started

### Goal
Beautiful, interactive match cards everywhere — with real country flags + real fixture data.

### Tasks
- [ ] Build `<MatchCard>` component showing:
  - Both **country flags** (use `flag-icons` library or country code SVGs)
  - Country names (real names: Mexico, South Africa, etc.)
  - Kickoff time in user timezone
  - Group label (Group A, etc.)
  - Stadium + city
  - Match status badge (Upcoming / LIVE / FT)
  - Score (if available)
  - Man of the Match badge slot (empty for upcoming)
- [ ] Add hover/tap animations (Framer Motion)
- [ ] Click card → navigate to match detail page (placeholder)
- [ ] Build `/schedule` page with all 104 matches
- [ ] Add filters: by date, by team, by group, by stage
- [ ] List view + Calendar view toggle
- [ ] Auto-detect user timezone + convert all times
- [ ] Mobile-first responsive
- [ ] Add loading skeletons

### Deliverable
`/schedule` page shows every match with real teams, real flags, real times — beautifully animated.

---

## 🔴 Sprint 3 — Live Scores + Match Detail + MOTM
**Dates:** May 28 – May 29, 2026 · **Status:** ⏳ Not Started

### Goal
Wire up real-time data + full match detail page including Man of the Match.

### Tasks
- [ ] Sign up for football-data.org API key (free tier)
- [ ] Sign up for API-Football backup key
- [ ] Set up Upstash Redis cache (reduce API calls)
- [ ] Create `/lib/api/footballData.ts` wrapper
- [ ] Add live score auto-refresh (every 30s for live matches)
- [ ] Add "LIVE" pulsing badge
- [ ] Build `/match/[id]` detail page:
  - Hero with both flags + names + score
  - Live commentary feed
  - Lineups (starting XI for both teams)
  - Match stats (possession, shots, fouls, corners)
  - Goal scorers + minute
  - Cards (yellow/red)
  - **Man of the Match section** (after FT)
- [ ] Add MOTM badge on match cards everywhere (after FT)
- [ ] Handle API rate limits gracefully

### Deliverable
Click any match → see full detail page with live data + MOTM after game ends.

---

## 🏆 Sprint 4 — Standings + Bracket
**Dates:** May 30 – May 31, 2026 · **Status:** ⏳ Not Started

### Goal
Beautiful, interactive standings tables + animated knockout bracket.

### Tasks

**Standings:**
- [ ] Build `/standings` page
- [ ] Beautiful card per group (12 groups: A-L)
- [ ] Live updating points table
- [ ] Color-coded rows: qualified (green), at risk (yellow), eliminated (red)
- [ ] Show: W, D, L, GF, GA, GD, Points
- [ ] Hover/tap row → expand with last 5 results
- [ ] Animated row updates (Framer Motion)
- [ ] Add team flag + name on each row

**Bracket:**
- [ ] Build `/bracket` page
- [ ] Visual interactive knockout bracket (Round of 32 → Final)
- [ ] Updates live as teams advance
- [ ] Click team → modal with team's tournament journey
- [ ] "Share my bracket prediction" feature (no money, just fun)
- [ ] Mobile: vertical stacked layout
- [ ] Desktop: horizontal tree layout

### Deliverable
`/standings` and `/bracket` both look professional and update in real-time.

---

## 🎬 Sprint 5 — Highlights Hub (FIFA.com Style)
**Dates:** Jun 1 – Jun 2, 2026 · **Status:** ⏳ Not Started

### Goal
A proper highlights archive organized by year — with WORKING video playback.

### Tasks
- [ ] Set up YouTube Data API v3 key
- [ ] Identify official channels:
  - FIFA official YouTube
  - FOX Soccer YouTube
  - BBC Sport YouTube
- [ ] Build `/highlights` page with sections by year:
  - **2026 (Current)** — show top 6, "See More" expands to all
  - **2022 (Qatar)** — top 6 + See More
  - **2018 (Russia)** — top 6 + See More
  - **2014 (Brazil)** — top 6 + See More
  - **2010 (South Africa)** — top 6 + See More
  - **Older archives** — collapsed by default
- [ ] **Proper YouTube iframe embeds** (videos must actually play, not be broken)
- [ ] Lazy-load videos (performance — only load when visible)
- [ ] Add filters: by team, by player, by goal type
- [ ] Show video title, date, duration, source channel
- [ ] Auto-fetch new 2026 highlights as matches finish
- [ ] Cache results in Supabase (avoid hitting API limits)

### Deliverable
Beautiful highlights hub with all years, working video playback, FIFA.com-style organization.

---

## 📺 Sprint 6 — Embedded Live Stream + Watch Buttons
**Dates:** Jun 3, 2026 · **Status:** ⏳ Not Started

### Goal
Show official live stream on homepage when match is live — fully legal embeds only.

### Tasks
- [ ] Build `<LiveStreamEmbed>` component
- [ ] Detect live FIFA YouTube broadcasts via YouTube API
- [ ] Embed FIFA's official live YouTube stream when available
- [ ] Build broadcaster database (`/data/broadcasters.ts`):
  - Per country → free + paid broadcaster
  - Examples: Toffee (BD), BBC iPlayer (UK), Foot.com (FR), CBC Gem (CA)
- [ ] Auto-detect user country (Vercel geolocation headers)
- [ ] "Change country" dropdown for manual override
- [ ] Big **"WATCH LIVE"** button on homepage when match live
  - Shows embed if FIFA YouTube is broadcasting
  - Else shows broadcaster options for user's country
- [ ] Add affiliate links to FIFA+, DAZN, ESPN+ where applicable
- [ ] **No piracy. No re-streaming. Only legal embeds + redirects.**

### Deliverable
Homepage shows live match stream when available, with country-specific watch buttons.

---

## 👥 Sprint 7 — Teams, Players, News
**Dates:** Jun 4, 2026 · **Status:** ⏳ Not Started

### Goal
Country pages with full squads + authentic FIFA news section.

### Tasks

**Teams & Players:**
- [ ] Build `/team/[country]` page for each of 48 nations
- [ ] Show country flag, name, manager, FIFA ranking
- [ ] **Full squad list** with player photos (use API-Football)
- [ ] Player info: name, position, club, age, jersey #
- [ ] Click player → `/player/[id]` page with stats
- [ ] Show all matches that country plays in WC 2026
- [ ] Previous World Cup history for the country

**News:**
- [ ] Build `/news` page
- [ ] Integrate RSS feeds from:
  - FIFA.com official RSS
  - BBC Sport (football)
  - ESPN FC
- [ ] News cards: headline + image + source + date
- [ ] Categories: General, Team-specific, Match previews, Player news
- [ ] **Each card links to original source** (we don't republish content)
- [ ] Top 3 news on homepage
- [ ] Auto-refresh every 30 minutes

### Deliverable
Every country has a team page with full squad. News section pulls authentic articles from FIFA/BBC/ESPN.

---

## 🧩 Sprint 8 — Browser Extension + Telegram Bot
**Dates:** Jun 5, 2026 · **Status:** ⏳ Not Started

### Goal
Ship the two companion products: Chrome extension + Telegram bot.

### Tasks

**Browser Extension:**
- [ ] Chrome extension project (Manifest V3)
- [ ] Content script: block popup ads on streaming sites
- [ ] Hide fake "Play" buttons (CSS heuristics)
- [ ] Block adult/gambling ad domains (filter list)
- [ ] Extension popup UI: toggle, stats, settings
- [ ] Pay Chrome Web Store fee ($5)
- [ ] Submit for review
- [ ] Privacy policy + listing page

**Telegram Bot:**
- [ ] Create bot via @BotFather
- [ ] Set up Node.js + Telegraf project
- [ ] Deploy to Railway
- [ ] Commands: `/start`, `/today`, `/standings`, `/team <name>`
- [ ] Cron: daily 9 AM "Today's matches" message
- [ ] Live goal alerts (poll API during live matches)
- [ ] Multi-language replies

### Deliverable
Chrome extension submitted to store. Telegram bot live and serving updates.

---

## 🌍 Sprint 9 — i18n, PWA, Polish, Testing
**Dates:** Jun 6, 2026 · **Status:** ⏳ Not Started

### Goal
Launch-ready: 5 languages, PWA, performance, accessibility, zero bugs.

### Tasks

**Internationalization (next-intl):**
- [ ] Add language toggle in header
- [ ] Translate UI: English, Bangla, Urdu, Arabic, Hindi
- [ ] RTL support for Arabic/Urdu
- [ ] Save language preference

**PWA:**
- [ ] Add manifest.json + service worker
- [ ] Cache static assets + fixtures offline
- [ ] "Install app" prompt
- [ ] App icons for all sizes

**Polish & Testing:**
- [ ] Lighthouse audit → target 95+ all metrics
- [ ] Test on real Android + iPhone
- [ ] Test on slow 2G/3G
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Fix all responsive breakpoints
- [ ] Accessibility audit (ARIA labels, keyboard nav, contrast)
- [ ] Set up Sentry error tracking
- [ ] Set up Plausible analytics
- [ ] SEO: meta tags, OpenGraph, sitemap
- [ ] Apply for Google AdSense + halal category filters
- [ ] Submit sitemap to Google Search Console

### Deliverable
Lighthouse 95+. Site available in 5 languages. PWA installable. Ready to handle launch traffic.

---

## 🚀 Launch Day — June 11, 2026

### Launch Tasks
- [ ] Final smoke test of all features
- [ ] Post on Reddit (r/soccer, r/worldcup, r/bangladesh, r/india, r/pakistan)
- [ ] Post on Twitter/X with hashtags
- [ ] Share in Facebook football groups
- [ ] WhatsApp share to friends/family
- [ ] Submit to Product Hunt
- [ ] Monitor analytics + errors in real-time
- [ ] Respond to user feedback within 1 hour

### Success Criteria
- ✅ Site stays up under load
- ✅ Live scores update in real-time
- ✅ 1,500+ visitors on Day 1
- ✅ 75+ extension installs
- ✅ 30+ Telegram bot users

---

## 📈 Post-Launch (Jun 11 – Jul 19, 2026)

### Daily Tasks
- [ ] Monitor uptime + errors
- [ ] Respond to user feedback
- [ ] Post on social media each match day
- [ ] Update broken stream links as users report
- [ ] Push small fixes daily

### Weekly Retrospectives
- [ ] Week 1 review (Jun 18)
- [ ] Week 2 review (Jun 25)
- [ ] Week 3 review (Jul 2)
- [ ] Week 4 review (Jul 9)
- [ ] Final review (Jul 20 — day after Final)

---

## 📂 Recommended Project Structure

```
matchhub/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .gitignore
│
├── assets/                  # Logo, brand assets (source SVGs)
│   ├── logo.svg
│   └── icon.svg
│
├── docs/                    # Project documentation
│   ├── roadmap.md
│   └── sprint.md
│
├── public/                  # Static files served to browser
│   ├── logo.svg
│   ├── favicon.ico
│   ├── manifest.json
│   └── flags/               # Country flag SVGs
│
├── data/                    # Seed data
│   ├── fixtures.ts          # All 104 real matches
│   ├── teams.ts             # 48 nations
│   └── broadcasters.ts      # Country → legal stream sources
│
├── app/                     # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx             # Homepage
│   ├── schedule/page.tsx
│   ├── match/[id]/page.tsx
│   ├── standings/page.tsx
│   ├── bracket/page.tsx
│   ├── highlights/page.tsx
│   ├── team/[country]/page.tsx
│   ├── player/[id]/page.tsx
│   ├── news/page.tsx
│   └── api/                 # API routes
│       ├── scores/route.ts
│       ├── news/route.ts
│       └── youtube/route.ts
│
├── components/              # React components
│   ├── layout/
│   │   ├── Header.tsx       # Logo, nav, theme toggle, lang
│   │   └── Footer.tsx
│   ├── match/
│   │   ├── MatchCard.tsx
│   │   ├── LiveScoreTicker.tsx
│   │   ├── MOTMBadge.tsx
│   │   └── LiveStreamEmbed.tsx
│   ├── standings/
│   │   └── GroupTable.tsx
│   ├── bracket/
│   │   └── KnockoutBracket.tsx
│   ├── highlights/
│   │   ├── HighlightVideo.tsx
│   │   └── YearSection.tsx
│   ├── news/
│   │   └── NewsCard.tsx
│   └── ui/                  # Buttons, badges, etc.
│
├── lib/                     # Utilities & API wrappers
│   ├── api/
│   │   ├── footballData.ts
│   │   ├── youtube.ts
│   │   └── rssNews.ts
│   ├── i18n.ts
│   └── utils.ts
│
├── messages/                # i18n translations
│   ├── en.json
│   ├── bn.json
│   ├── ur.json
│   ├── ar.json
│   └── hi.json
│
├── extension/               # Chrome extension (separate workspace)
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html
│   └── popup.js
│
└── bot/                     # Telegram bot (separate workspace)
    ├── index.js
    └── handlers/
```

---

## 📝 Daily Update Template

Copy this for daily standups & commit messages:

```
Date: YYYY-MM-DD
Sprint: X
Done: [completed tasks]
Doing: [in-progress tasks]
Blocked: [any blockers]
Next: [next 1-2 tasks]
```

---

## ✅ Definition of Done

A task is **DONE** when:
1. ✅ Code works locally
2. ✅ Deployed to production (Vercel)
3. ✅ Tested on real mobile device
4. ✅ Committed using **Conventional Commits** format (`feat:`, `fix:`, `docs:`, etc.)
5. ✅ Checkbox above is checked
