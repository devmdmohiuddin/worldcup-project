// Content-script blocker. Runs at document_start.
// - Injects a page-world script that intercepts window.open / form submissions.
// - Removes fake play buttons & malicious overlays via CSS heuristics.
// - Reports counts back to the service worker for the toolbar badge.
(() => {
  if (window.__cleanStreamBlocker) return;
  window.__cleanStreamBlocker = true;

  const mode = window.__cleanStreamMode || "off";
  if (mode === "off") return;

  const counters = { popups: 0, fakeButtons: 0, overlays: 0 };
  let lastReport = 0;

  function report(kind) {
    counters[kind] = (counters[kind] || 0) + 1;
    const now = Date.now();
    if (now - lastReport < 250) return;
    lastReport = now;
    try {
      chrome.runtime?.sendMessage?.({
        type: "cs:blocked",
        host: location.hostname,
        counters: { ...counters },
      });
    } catch (_) {
      /* extension context may be invalidated on reload */
    }
  }

  // ---- 1. Page-world popup interceptor ----
  // window.open / target=_blank navigations triggered without a real user
  // gesture are the #1 vector for streaming-site popunders. We can only
  // hook those reliably from the page world, not the isolated world.
  const inject = document.createElement("script");
  inject.src = chrome.runtime.getURL("content/injected.js");
  inject.async = false;
  inject.dataset.csMode = mode;
  (document.head || document.documentElement).prepend(inject);
  inject.remove();

  window.addEventListener(
    "message",
    (e) => {
      if (e.source !== window) return;
      if (e.data && e.data.__cs === "popup-blocked") report("popups");
    },
    true,
  );

  // ---- 2. Fake play-button & overlay CSS heuristics ----
  // Most streaming sites layer a transparent <a> or <div> on top of the
  // real video. Fake play buttons usually live inside the player container
  // but link to an ad domain — detect those.
  function isAdHref(href) {
    if (!href) return false;
    try {
      const u = new URL(href, location.href);
      if (u.origin === location.origin) return false;
      const h = u.hostname.toLowerCase();
      // host-only TLDs commonly used by ad/redirect networks.
      return /(\.top|\.click|\.xyz|\.live|\.bid|\.win|\.loan|\.gq|\.tk|\.cf|\.ml|popads|propellerads|adsterra|hilltopads|exoclick)/.test(
        h,
      );
    } catch {
      return false;
    }
  }

  function scrubFakeButtons(root) {
    const players = root.querySelectorAll?.(
      'video, .player, .video-player, [id*="player" i], [class*="player" i]',
    );
    if (!players || !players.length) return;
    players.forEach((p) => {
      const links = p.parentElement?.querySelectorAll?.("a[href], a[target]");
      links?.forEach((a) => {
        if (isAdHref(a.getAttribute("href"))) {
          a.style.pointerEvents = "none";
          a.style.opacity = "0";
          a.setAttribute("data-cs-blocked", "fake-button");
          report("fakeButtons");
        }
      });
    });
  }

  function scrubOverlays(root) {
    // Fullscreen / near-fullscreen fixed elements with a high z-index that
    // sit on top of the page are the classic "click anywhere to install"
    // overlay. Only nuke ones with ad/redirect anchors inside.
    const candidates = root.querySelectorAll?.(
      'div[style*="position: fixed"], div[style*="position:fixed"]',
    );
    candidates?.forEach((el) => {
      const style = getComputedStyle(el);
      const big =
        parseInt(style.width) >= window.innerWidth * 0.6 &&
        parseInt(style.height) >= window.innerHeight * 0.5;
      const z = parseInt(style.zIndex || "0", 10);
      if (!big || z < 1000) return;
      const links = el.querySelectorAll("a[href]");
      const hasAd = Array.from(links).some((a) => isAdHref(a.getAttribute("href")));
      if (hasAd) {
        el.style.display = "none";
        el.setAttribute("data-cs-blocked", "overlay");
        report("overlays");
      }
    });
  }

  function sweep() {
    scrubFakeButtons(document);
    if (mode === "strict") scrubOverlays(document);
  }

  // Initial sweep once the DOM is parseable + observe mutations.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sweep, { once: true });
  } else {
    sweep();
  }

  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) {
        sweep();
        break;
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // ---- 3. Tell SW we're active so it can colour the badge ----
  try {
    chrome.runtime?.sendMessage?.({
      type: "cs:active",
      host: location.hostname,
      mode,
    });
  } catch (_) {
    /* noop */
  }
})();
