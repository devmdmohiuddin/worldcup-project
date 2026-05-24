# Chrome Web Store Listing — Clean Stream by FootballClean

## Short description (132 char max)

Block popups, fake play buttons, and adult/gambling ads on football streaming sites. Halal-friendly. No tracking. No piracy.

## Detailed description

**Watch football in peace. Skip the dangerous ads.**

Clean Stream is the companion extension to FootballClean.com — built for fans
who just want to watch the match without dodging popups, fake "PLAY" buttons,
gambling banners, and adult ads that have no business on a sports site.

### What it blocks

- 🚫 **Popups & popunders** — including the new-tab kind that fire on every click
- 🎯 **Fake play buttons** — the third-party overlays that look like the player but link to ad networks
- 🛡️ **Malicious overlays** — full-screen "click to install" traps
- ❌ **Adult ad networks** — JuicyAds, ExoClick, TrafficJunky, and more
- 🎰 **Gambling / betting ads** — 1xBet, Bet365, Stake, DraftKings, FanDuel, etc.
- 🪤 **Malware & scam redirectors** — PopAds, PropellerAds, HilltopAds, Adsterra

### Why this exists

Most "ad blockers" leave streaming-site garbage untouched, and many actually
whitelist gambling and adult networks for revenue. Clean Stream is built by
Muslim football fans for a halal-friendly experience: zero gambling
partnerships, zero adult-network exceptions, zero affiliate dark patterns.

### Privacy

- 100% on-device. We never see what you browse.
- No telemetry, no analytics, no account, no signup.
- Open about what we block — see our filter lists on GitHub.

### Free vs Premium

All current features are **free, forever**. Premium (launching later in 2026)
will add prayer-aware muting, custom filter lists, and multi-device dashboards
— purely additive. Free users keep every feature you see today.

### About FootballClean

FootballClean is a halal-first World Cup 2026 companion: free legal streaming
guide for 60+ countries, live scores, prayer-aware schedules, and a Telegram
bot. Visit footballclean.com.

## Single purpose

The single purpose of this extension is to remove dangerous and unwanted
advertising (popups, fake play buttons, malicious overlays, adult and
gambling ad networks) from football streaming sites the user already visits.

## Permission justifications

- **storage** — to remember the user's category toggles and per-site overrides locally.
- **declarativeNetRequest** — required to block ad-network domains via Chrome's static block lists.
- **declarativeNetRequestFeedback** — to display the count of blocked requests in the popup badge.
- **tabs** — to read the active tab's hostname for the popup UI and badge state.
- **scripting** — to inject the page-world popup interceptor that overrides `window.open` before pages register their popunder handlers.
- **host_permissions `<all_urls>`** — required because streaming-aggregator domains are not enumerable; popup ads and fake play buttons appear on long-tail domains. Sensitive properties (Google, GitHub, banking, payment processors) are excluded via `exclude_matches`.

## Category

Productivity (with Accessibility relevance — improves usable surface area on streaming pages).
