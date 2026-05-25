# 🗺️ MatchHub — Roadmap

## 🎯 Vision

Become the **most complete, beautiful, and trusted** World Cup 2026 destination on the web — combining the comprehensiveness of FIFA.com with the speed, multilingual support, and clean experience that users actually want.

## 🌟 Mission

When a fan opens MatchHub, they get **everything** in one place:
- Live streams (via legal embeds)
- Live scores
- Highlights organized by year
- Fixtures with real teams + flags
- Standings + bracket
- Player rosters per country
- Authentic news
- Man of the Match for every game

No piracy. No popups. No 12 different sites. Just **one beautiful hub**.

## 👥 Target Audience

| Audience | Why They Need Us |
|---|---|
| 🌍 **Global football fans** | One place for everything — FIFA.com depth, faster + cleaner |
| 🌏 **South Asian fans** (BD, IN, PK) | Bangla/Urdu/Hindi support, free stream guides for their region |
| 💼 **Office workers** | Telegram bot for updates while at work |
| 📱 **Mobile-first users** | Lightweight PWA, sub-second loads on slow internet |
| 🎓 **Casual fans** | Beautiful UI, easy to follow without prior knowledge |

## 🚨 Problem We Solve

```
Today:
User opens Google → searches "Argentina vs Brazil"
   ↓
Goes to 5 different sites for: stream, score, lineup, news, highlights
   ↓
Each site = slow, ad-heavy, broken, or paywalled
   ↓
Frustration 😡

With MatchHub:
User opens matchhub.live
   ↓
ONE page shows: stream, live score, lineup, MOTM, news, highlights
   ↓
Done in 2 seconds ✅
```

## 📦 Complete Feature List

### 🏠 Homepage (The Hub)

The homepage is the centerpiece — inspired by FIFA.com but **better organized**.

- [ ] 🔴 **Live Match Section** — When match is live, show:
  - Embedded official YouTube stream (if available in user's region)
  - Live score with auto-refresh
  - "Watch on official broadcaster" button (links to user's country's legal stream)
- [ ] 📅 **Today's Matches** — All matches happening today with countdown
- [ ] 🎬 **Latest Highlights** — Most recent match highlights (FIFA YouTube embeds)
- [ ] 🏆 **Standings Snapshot** — Top of each group
- [ ] 📰 **Top News** — 3 latest authentic news cards
- [ ] 🪜 **Bracket Snapshot** — Mini interactive bracket

### ⚽ Match Cards (Used Everywhere)

Every match card shows:
- [ ] 🏳️ **Both country flags** (large, prominent)
- [ ] Country names (in user's language)
- [ ] Match score (or kickoff time if not started)
- [ ] Group label (Group A, B, C... or Round of 16, etc.)
- [ ] Stadium + city
- [ ] Match status (LIVE / HT / FT / Upcoming)
- [ ] 🏅 **Man of the Match** badge (after match ends)
- [ ] Quick actions: Watch, Highlights, Stats

### 📅 Schedule Page

- [ ] All 104 real fixtures (e.g. *Mexico vs South Africa, Jun 11, Group A, Mexico City*)
- [ ] Timezone auto-conversion
- [ ] Filters: by date, team, group, stage
- [ ] List + Calendar views
- [ ] Each fixture clickable → match detail page

### 🎥 Match Detail Page

When user clicks any match:
- [ ] Big banner with both flags
- [ ] Live score (if live) or final score
- [ ] **Embedded official live stream** (when legally available)
- [ ] "Watch on official broadcaster" buttons by country
- [ ] Live commentary (text updates)
- [ ] Lineups (starting XI for both teams)
- [ ] Match stats (possession, shots, cards)
- [ ] Man of the Match (after FT)
- [ ] Goal scorers + minute
- [ ] **Embedded highlights** (after FT, from official YouTube)
- [ ] "Watch full replay" → links to FIFA+ official replay (we don't host)

### 🏆 Standings Page

- [ ] **Beautiful, interactive** group tables
- [ ] Live updating
- [ ] Color-coded: qualified (green), at risk (yellow), eliminated (red)
- [ ] Hover/tap each team → expand stats
- [ ] Goal difference, goals scored/conceded
- [ ] Last 5 results visualization

### 🪜 Knockout Bracket

- [ ] **Interactive animated bracket**
- [ ] Updates live as teams advance
- [ ] Click team → see their journey through tournament
- [ ] Shareable bracket image (social media)

### 🎬 Highlights Hub (FIFA.com Style)

Organized by World Cup year, descending:

- [ ] **2026 (Current)** — Latest match highlights
- [ ] **2022 (Qatar)** — Classic moments
- [ ] **2018 (Russia)**
- [ ] **2014 (Brazil)**
- [ ] **2010 (South Africa)**
- [ ] **Older archives**

Each section:
- [ ] Shows top 6 videos initially
- [ ] "See More" button → expand to full archive
- [ ] Filter by team, player, goal type
- [ ] All videos are **embedded YouTube** (FIFA official channel — we don't upload)
- [ ] **Working playback** (proper iframe embeds, not broken thumbnails)

### 👥 Teams & Players

- [ ] **Country pages** — One for each of 48 nations
- [ ] Full **squad list** with player photos
- [ ] Player profiles: stats, position, club, age
- [ ] Manager info
- [ ] Previous World Cup history for that country
- [ ] All matches that team plays in WC 2026

### 📰 News Section

- [ ] Aggregated from **authentic official sources only**:
  - FIFA.com (official RSS)
  - BBC Sport (official RSS)
  - ESPN FC (official RSS)
  - The Athletic (where allowed)
- [ ] Each article links to original source (we don't republish content)
- [ ] Categories: General, Team-specific, Player news, Match previews
- [ ] No fake news, no clickbait, no rumor mills

### 🌍 Internationalization

- [ ] 🇬🇧 English (default)
- [ ] 🇧🇩 Bangla
- [ ] 🇵🇰 Urdu
- [ ] 🇸🇦 Arabic
- [ ] 🇮🇳 Hindi

### 🎨 UI/UX Standards

- [ ] **Light mode default**, dark mode toggle in header
- [ ] User preference saved (localStorage)
- [ ] Smooth Framer Motion animations
- [ ] Skeleton loaders (no blank screens)
- [ ] Micro-interactions on hover/tap
- [ ] Mobile-first responsive
- [ ] PWA installable
- [ ] Lighthouse score 95+

### 🧩 Browser Extension Features

- [ ] Block popup ads on all streaming sites
- [ ] Hide fake "Play" buttons
- [ ] Remove redirects + malicious overlays
- [ ] Filter adult/gambling ads
- [ ] Free tier + Premium ($2/month)

### 🤖 Telegram Bot Features

- [ ] Daily "Today's matches" message at 9 AM
- [ ] Live goal alerts (per favorite team)
- [ ] Match start reminders (15 min before)
- [ ] Highlights link after full-time
- [ ] Multi-language replies

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 15 + Tailwind CSS | Fast SSR, great SEO |
| Animations | Framer Motion | Smooth, interactive UI |
| State | React Query | Live data caching |
| Backend | Next.js API Routes | Unified |
| Database | Supabase (Postgres) | Free tier, auth-ready |
| Cache | Upstash Redis | Live scores cache |
| Live Scores | football-data.org | Free API |
| Highlights/Live | YouTube Data API v3 | Official embeds only |
| News | RSS Parser (FIFA, BBC, ESPN) | Authentic sources |
| i18n | next-intl | Multi-language |
| Extension | Chrome Manifest V3 | Modern standard |
| Bot | Node.js + Telegraf | Industry standard |
| Hosting | Vercel + Railway | Free tiers |
| Analytics | Plausible | Privacy-friendly |

## ⚖️ Legal & Halal Boundaries

### What We DO

- ✅ Embed official YouTube videos (FIFA channel, broadcaster channels) — fully allowed by YouTube
- ✅ Embed live streams when broadcasters publish them publicly (e.g., FIFA YouTube live during free-to-air matches)
- ✅ Use free public APIs for scores/data
- ✅ Aggregate news with source links (fair use)
- ✅ Link users to legal broadcasters in their country

### What We Do NOT

- ❌ Host or re-stream any video content ourselves
- ❌ Provide downloads of any match
- ❌ Scrape pirate streams
- ❌ Show gambling/adult/alcohol ads (AdSense category filters enforced)
- ❌ Republish news article content (only headlines + link)

## 💰 Monetization Strategy

| Stream | Monthly Estimate |
|---|---|
| Google AdSense (halal-filtered) | $150 – $700 |
| Affiliate (FIFA+, DAZN, ESPN+, VPN) | $100 – $600 |
| YouTube embed revenue share | $20 – $100 |
| Browser extension Premium ($2/mo) | $50 – $2,000 |
| Telegram bot Premium tier | $30 – $200 |
| **Total Potential** | **$350 – $3,600/mo** |

## 📊 Success Metrics

### Launch Month (Jun 11 – Jul 19, 2026)

| Metric | Target |
|---|---|
| Total visitors | 75,000+ |
| Returning users | 35%+ |
| Avg session time | 4+ minutes |
| Extension installs | 1,500+ |
| Telegram bot subs | 800+ |
| Lighthouse score | 95+ |
| Total earnings | $400+ |

## 🎯 Competitive Positioning

| | FIFA.com | ESPN | LiveSoccerTV | **MatchHub** |
|---|---|---|---|---|
| Real fixtures + flags | ✅ | ✅ | ✅ | ✅ |
| Embedded live streams | ⚠️ (paywall) | ⚠️ (paywall) | ❌ | ✅ (free, legal) |
| Highlights by year | ✅ | ❌ | ❌ | ✅ |
| Standings | ✅ | ✅ | ❌ | ✅ (more beautiful) |
| Bracket | ✅ | ✅ | ❌ | ✅ (interactive) |
| Player rosters | ✅ | ⚠️ | ❌ | ✅ |
| Authentic news | ✅ | ✅ | ❌ | ✅ (aggregated) |
| Man of the Match | ✅ | ✅ | ❌ | ✅ |
| Bangla/Urdu/Hindi | ❌ | ❌ | ❌ | ✅ |
| Sub-second load | ❌ | ❌ | ⚠️ | ✅ |
| Browser ad blocker | ❌ | ❌ | ❌ | ✅ |
| Telegram bot | ❌ | ❌ | ❌ | ✅ |

## 🚀 Long-Term Vision

Beyond World Cup 2026:
- 🏆 **Euro 2028, Copa America, AFCON** — reuse platform
- ⚽ **Domestic leagues** — EPL, La Liga, Bundesliga, Champions League
- 🌍 **Cricket version** — same model for cricket World Cup, IPL
- 📱 **Native mobile apps** — iOS + Android (Phase 4)

## ✊ Guiding Principles

1. **Halal first** — Every feature, every ad, every partnership
2. **Authentic sources only** — News, scores, streams, highlights
3. **Speed matters** — Sub-second loads on slow networks
4. **Beautiful UI** — On par with FIFA.com or better
5. **Mobile-first** — 80% of users on phones
6. **User trust** — No piracy, no dark patterns, no fake content
