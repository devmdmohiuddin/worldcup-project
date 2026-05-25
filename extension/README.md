# Clean Stream (Chrome extension)

Family-friendly companion extension to [MatchHub](https://matchhub.live).
Blocks popup ads, fake play buttons, malicious overlays, and adult/gambling ad
networks on football streaming sites.

## Load locally (development)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this `extension/` directory.
4. Pin the toolbar icon. Visit any streaming site and watch the badge tick.

## Project layout

```
extension/
├── manifest.json              # MV3 manifest
├── background/
│   ├── service-worker.js      # badge + messaging
│   └── settings.js            # storage model + premium gate
├── content/
│   ├── detector.js            # site-mode heuristic (off | light | strict)
│   ├── blocker.js             # DOM scrub for fake buttons + overlays
│   └── injected.js            # page-world window.open hijack
├── popup/                     # toolbar popup (status + per-site stats)
├── options/                   # full settings page (overrides + premium card)
├── rules/                     # declarativeNetRequest static rule lists
│   ├── adult_gambling.json
│   ├── malware.json
│   └── popup_trackers.json
├── icons/
├── PRIVACY.md
└── LISTING.md                 # Chrome Web Store listing copy
```

## Free vs Premium

All features here are free. The `tier` field in settings (`free` | `premium`)
gates UI affordances only — premium features ship in a later sprint. See
[`background/settings.js`](background/settings.js).

## Filter list curation

Rule IDs are namespaced so the lists can grow without collisions:

- `1xxx` — adult & gambling networks (`rules/adult_gambling.json`)
- `2xxx` — popup / popunder / chumbox networks (`rules/malware.json`)
- `3xxx` — popup-tracker patterns (`rules/popup_trackers.json`)

Add new domains as `||example.com^` URL filters. Keep the lists conservative —
false-positive blocks on legitimate broadcasters break the product more than
missed ads.

## Submitting to the Chrome Web Store

1. Pay the one-time $5 developer fee.
2. Zip the contents of `extension/` (not the folder itself).
3. Upload via the [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole).
4. Paste content from [`LISTING.md`](LISTING.md) into the listing fields.
5. Link [`PRIVACY.md`](PRIVACY.md) hosted at https://matchhub.live/extension/privacy.
6. Submit for review — expect 1–7 days.
