# Privacy Policy — Clean Stream by FootballClean

_Last updated: 2026-05-24_

Clean Stream is built and maintained by FootballClean (https://footballclean.com).
This policy describes exactly what the extension does and does not do with your
data. Plain English, no dark patterns.

## TL;DR

- We do **not** collect personal data.
- We do **not** track your browsing history.
- We do **not** send any data to our servers.
- Settings and block counts stay on your device (or your Chrome sync profile).
- We do **not** sell or share data with third parties.

## What the extension does

Clean Stream runs locally in your browser. It:

1. Reads the URL of the page you are visiting **only to decide whether the
   page looks like a streaming site** and which cleanup rules to apply.
2. Blocks network requests to known adult, gambling, malware, and popup-ad
   domains using Chrome's `declarativeNetRequest` API. These blocks happen
   entirely inside Chrome — no external service is contacted.
3. Hides fake play buttons and malicious full-screen overlays by inspecting
   the DOM of the active page.
4. Counts how many popups, fake buttons, and overlays it blocked, so we can
   show the badge counter and lifetime statistics.

## What the extension stores

The following is saved using Chrome's `storage.sync` API (so it follows you
between devices signed into the same Chrome profile) or `storage.local` if
sync is unavailable:

- Your enable/disable toggle and category preferences.
- Per-site overrides you create (host + "allow" or "block").
- Lifetime block counters (numbers only, no URLs).
- The timestamp of when you installed the extension.

No URLs, no page contents, no titles, no search queries.

## What the extension does NOT do

- It does not enable, link to, or facilitate piracy. Clean Stream only
  cleans up sites you have already chosen to visit.
- It does not contact any FootballClean server. There is no telemetry
  endpoint.
- It does not inject ads, affiliate links, or paid content into pages.
- It does not modify legitimate broadcasters (BBC, ITV, FOX, FIFA+, etc.)
  beyond removing third-party ad-network requests if you have them
  enabled.

## Halal compliance

The extension is part of the FootballClean halal-friendly product family:

- No gambling, betting, or sportsbook ads or affiliate codes are included
  or recommended.
- No interest-bearing financial services are included.
- No adult ad networks are recommended or whitelisted.

## Permissions explained

- `storage` — to remember your settings.
- `declarativeNetRequest` + `declarativeNetRequestFeedback` — to block ad
  domains and show how many were blocked.
- `tabs` — to know which tab you are looking at so the badge shows the
  right count.
- `scripting` — to inject the popup-blocker page script.
- `<all_urls>` host permission — necessary to detect popup ads and fake
  play buttons regardless of which streaming aggregator you visit. We
  exclude sensitive domains (Google, GitHub, banking, PayPal, Stripe) in
  the manifest.

## Contact

Questions or concerns: support@footballclean.com
