// Page-world script. Loaded by blocker.js via web_accessible_resources so that
// it can override window.open *before* the page registers its handlers.
(() => {
  if (window.__cleanStreamInjected) return;
  window.__cleanStreamInjected = true;

  const mode =
    document.currentScript?.dataset?.csMode ||
    window.__cleanStreamMode ||
    "off";

  if (mode === "off") return;

  const realOpen = window.open;
  let lastUserGesture = 0;

  // Track real user input. Synthetic events from scripts won't have isTrusted.
  ["click", "keydown", "touchstart"].forEach((evt) =>
    window.addEventListener(
      evt,
      (e) => {
        if (e.isTrusted) lastUserGesture = Date.now();
      },
      true,
    ),
  );

  function fromGesture() {
    return Date.now() - lastUserGesture < 1000;
  }

  function notifyBlocked() {
    try {
      window.postMessage({ __cs: "popup-blocked" }, "*");
    } catch (_) {
      /* noop */
    }
  }

  // window.open hijack — block unless tied to a real gesture.
  // In strict mode we additionally drop windows opened to known ad TLDs.
  window.open = function (url, target, features) {
    try {
      if (!fromGesture()) {
        notifyBlocked();
        return null;
      }
      if (mode === "strict" && typeof url === "string") {
        if (/(\.top|\.click|\.xyz|\.live|\.bid|\.win|\.loan|popads|propellerads|adsterra|hilltopads|exoclick)/i.test(url)) {
          notifyBlocked();
          return null;
        }
      }
    } catch (_) {
      /* fall through */
    }
    return realOpen.apply(this, arguments);
  };

  // Some popunder libraries assign window.location during a fake click on a
  // hidden iframe. We can't safely block all location writes, but we can stop
  // anchor clicks that point to ad TLDs and weren't user-initiated.
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target && e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (
        /(\.top|\.click|\.xyz|\.live|\.bid|\.win|\.loan|popads|propellerads|adsterra|hilltopads|exoclick)/i.test(
          href,
        ) &&
        !fromGesture()
      ) {
        e.preventDefault();
        e.stopPropagation();
        notifyBlocked();
      }
    },
    true,
  );
})();
