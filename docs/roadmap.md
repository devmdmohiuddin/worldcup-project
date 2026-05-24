# 🗺️ FootballClean — Roadmap

## 🎯 Vision

To become the **most trusted, distraction-free destination** for football fans worldwide to discover where to watch matches legally, follow live scores, and enjoy highlights — without ads, popups, or haram content.

## 🌟 Mission

Solve the broken football streaming experience by:

1. Guiding users to **legal streams** (free + paid) instead of pirate sites
2. **Cleaning up** the ad mess on existing legitimate sites via browser extension
3. Providing **clean, fast, multilingual** match info, scores, and highlights

## 👥 Target Audience

| Audience                             | Why They Need Us                                                     |
| ------------------------------------ | -------------------------------------------------------------------- |
| 🕌 **Muslim football fans**          | Prayer time conflict alerts, no haram ads, halal-friendly            |
| 🌏 **South Asian fans** (BD, IN, PK) | Bangla/Urdu/Hindi support, free legal stream guides for their region |
| 💼 **Office workers**                | Quick scores, Telegram bot for updates while at work                 |
| 📱 **Mobile-first users**            | Lightweight PWA, works on 2G internet                                |
| 🎓 **Young fans**                    | Free, clean, mobile-friendly, no credit card needed                  |

## 🚨 Problem Statement

Today, when a user wants to watch a football match:

```
User → Google → 50 pirate sites → Popups → Fake play buttons →
Malware risk → Adult ads → Stream breaks → Frustration 😡
```

Even if they find a legal stream, they don't know **which one is free in their country**.

## ✅ Our Solution

```
User → FootballClean → Instantly shown:
  ✅ Free legal streams in their country
  ✅ Live score
  ✅ Highlights after match
  ✅ Browser extension cleans any streaming site
  ✅ Telegram bot for daily updates
```

## 📦 Core Features

### 🌐 Website Features

#### MVP (Launch Day)

- [ ] Full match schedule (104 matches, all 32 teams)
- [ ] Timezone auto-conversion
- [ ] Live scores (real-time via API)
- [ ] "Where to watch" by country (free + paid options)
- [ ] Group standings (auto-updating)
- [ ] Knockout bracket visualizer
- [ ] Mobile-first responsive design (PWA installable)
- [ ] Dark mode default
- [ ] No login required

#### Phase 2 (Week 1 after launch)

- [ ] Team pages (squad, history, stats)
- [ ] Player pages (stats, goals, cards)
- [ ] Highlights hub (embedded FIFA YouTube)
- [ ] Prayer time integration with match conflict warnings
- [ ] Multi-language support (EN, BN, UR, AR, HI)
- [ ] Browser push notifications

#### Phase 3 (Bonus)

- [ ] Halal prediction league (friends, no money, no betting)
- [ ] Match discussion rooms (moderated)
- [ ] AI match insights / summaries
- [ ] Watch party finder (halal cafes nearby)
- [ ] Email digest subscription

### 🧩 Browser Extension Features

- [ ] Block popup ads on all streaming sites
- [ ] Hide fake "Play" buttons and overlay tricks
- [ ] Remove redirects
- [ ] Filter out adult/gambling ads
- [ ] Auto-dismiss fake virus warnings
- [ ] Free tier (basic blocking)
- [ ] Premium tier — $2/month (advanced features, priority updates)

### 🤖 Telegram Bot Features

- [ ] Daily message: "Today's matches + where to watch"
- [ ] Live goal alerts (per favorite team)
- [ ] Pre-match reminder (15 min before)
- [ ] Highlights link after full-time
- [ ] Group standings on command
- [ ] Multi-language replies

## 🛠️ Tech Stack

| Layer        | Technology                | Reason                              |
| ------------ | ------------------------- | ----------------------------------- |
| Frontend     | Next.js 15 + Tailwind CSS | Fast SSR, great SEO, easy styling   |
| State        | React Query               | Cache live score data efficiently   |
| Backend      | Next.js API Routes        | No separate backend needed          |
| Database     | Supabase (Postgres)       | Free tier, auth-ready               |
| Cache        | Redis (Upstash free)      | Cache live scores, reduce API calls |
| Live Scores  | football-data.org API     | Free, reliable, World Cup support   |
| Highlights   | YouTube embed API         | Free, legal                         |
| Prayer Times | Aladhan API               | Free, accurate                      |
| Extension    | Chrome Manifest V3        | Modern standard                     |
| Bot          | Node.js + Telegraf        | Industry standard                   |
| Web Hosting  | Vercel                    | Free tier, auto-deploy              |
| Bot Hosting  | Railway                   | Free tier, easy cron                |
| Analytics    | Plausible / Umami         | Privacy-friendly, halal             |

## 💰 Monetization Strategy

| Stream                                     | Type        | Estimated Monthly    |
| ------------------------------------------ | ----------- | -------------------- |
| Google AdSense (filtered halal categories) | Display ads | $100 – $500          |
| Affiliate (DAZN, ESPN+, VPN services)      | Commission  | $100 – $500          |
| YouTube embed revenue share                | Passive     | $20 – $100           |
| Browser extension Premium ($2/mo)          | SaaS        | $50 – $2,000         |
| Telegram bot Premium tier                  | SaaS        | $30 – $200           |
| **Total Potential**                        | —           | **$300 – $3,300/mo** |

### Halal Filters

- ❌ No gambling/betting ads
- ❌ No adult content ads
- ❌ No interest-based (riba) financial product ads
- ✅ Only sports merchandise, halal food delivery, VPN, education

## 📊 Success Metrics

### Launch Month Targets (June 11 – July 19, 2026)

| Metric                   | Target  |
| ------------------------ | ------- |
| Total visitors           | 50,000+ |
| Returning users          | 30%+    |
| Extension installs       | 1,000+  |
| Telegram bot subscribers | 500+    |
| Page load speed          | < 1.5s  |
| Total earnings           | $300+   |

### 6-Month Targets

| Metric                    | Target  |
| ------------------------- | ------- |
| Monthly active users      | 20,000+ |
| Premium extension users   | 200+    |
| Monthly recurring revenue | $500+   |

## 🚀 Long-Term Vision

FootballClean isn't just for World Cup 2026 — it's the foundation for a **year-round football platform**:

- ⚽ **Euro 2028, Copa America, AFCON** — reuse for every tournament
- 🏆 **Domestic leagues** — EPL, La Liga, Bundesliga, Champions League
- 🌍 **Cricket version** — same model for World Cup, IPL (huge South Asian market)
- 📱 **Native mobile app** — iOS + Android (Phase 4)
- 🤝 **Sponsorships** — Direct deals with halal brands

## 🎯 Competitive Edge

| Competitor   | They Do                             | We Do                                              |
| ------------ | ----------------------------------- | -------------------------------------------------- |
| LiveSoccerTV | Schedule + stream links             | + Browser ad blocker + Telegram bot + Prayer times |
| ESPN         | Scores + news                       | + Multilingual + Mobile-first + Halal-friendly     |
| FlashScore   | Live scores only                    | + Stream finder + Highlights + Community           |
| Pirate sites | Free streams (illegal, full of ads) | Clean experience around LEGAL streams              |

## 📅 Roadmap Phases

```
Phase 1: BUILD       (May 24 – Jun 6, 2026)  → See sprint.md
Phase 2: POLISH      (Jun 7 – Jun 10, 2026)  → Bug fixes, performance, marketing
Phase 3: LAUNCH      (Jun 11, 2026)          → World Cup opening day 🚀
Phase 4: GROWTH      (Jun – Jul 2026)        → User feedback, viral features
Phase 5: RETENTION   (Aug 2026 onwards)      → Convert to year-round platform
```

## ✊ Guiding Principles

1. **Halal first** — Every feature, every ad, every partnership must be halal
2. **Speed matters** — Sub-second loading on slow networks
3. **Mobile-first** — 80% of users will be on phones
4. **Privacy-respecting** — No invasive tracking, GDPR-friendly
5. **User trust** — No popups, no dark patterns, no shady tactics
6. **Honest marketing** — Real numbers, real value, no fake hype
