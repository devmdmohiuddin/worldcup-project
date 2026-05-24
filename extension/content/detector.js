// Streaming-site detector. Decides whether aggressive blocking should run.
// Lives in document_start so the popup-blocker page-script can install before
// the page registers its own handlers.
(() => {
  if (window.__cleanStreamDetector) return;
  window.__cleanStreamDetector = true;

  // Heuristic 1: known legit football broadcasters. Always cleaned (light mode).
  const LEGIT_BROADCASTERS = [
    "bbc.co.uk",
    "bbc.com",
    "itv.com",
    "tf1.fr",
    "francetv.fr",
    "ard.de",
    "zdf.de",
    "rai.it",
    "rtve.es",
    "cbc.ca",
    "sbs.com.au",
    "tsports.com",
    "toffeelive.com",
    "foxsports.com",
    "fubo.tv",
    "dazn.com",
    "espn.com",
    "sonyliv.com",
    "beinsports.com",
    "supersport.com",
    "fifa.com",
    "plus.fifa.com",
  ];

  // Heuristic 2: signals that a page is a generic streaming aggregator
  // (the kind that ships dangerous popup ads). Used to enable "strict" mode.
  const STREAMING_KEYWORDS = [
    "live",
    "stream",
    "watch",
    "soccer",
    "football",
    "match",
    "score",
    "sport",
  ];

  const host = location.hostname.toLowerCase();
  const path = location.pathname.toLowerCase();

  const isLegit = LEGIT_BROADCASTERS.some(
    (d) => host === d || host.endsWith("." + d),
  );

  const looksLikeStream =
    STREAMING_KEYWORDS.some((k) => host.includes(k) || path.includes(k)) ||
    document.querySelector?.('video, iframe[src*="embed"], iframe[src*="player"]') !=
      null;

  window.__cleanStreamMode = isLegit
    ? "light"
    : looksLikeStream
      ? "strict"
      : "off";
})();
