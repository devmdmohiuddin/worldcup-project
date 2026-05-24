const port = chrome.runtime.connect({ name: "cs:popup" });

const els = {
  enabled: document.getElementById("cs-enabled"),
  host: document.getElementById("cs-host"),
  modeTag: document.getElementById("cs-mode-tag"),
  modeDot: document.getElementById("cs-mode-dot"),
  popups: document.getElementById("cs-popups"),
  fakebtns: document.getElementById("cs-fakebtns"),
  overlays: document.getElementById("cs-overlays"),
  lifetime: document.getElementById("cs-lifetime"),
  options: document.getElementById("cs-options"),
};

let lastSettings = null;

function hostFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "—";
  }
}

function renderMode(host) {
  // Mirror detector.js heuristic for popup display only — the actual
  // runtime decision is made by the content script.
  const LEGIT = /(bbc|itv|tf1|francetv|ard|zdf|rai|rtve|cbc|sbs|tsports|toffeelive|foxsports|fubo|dazn|espn|sonyliv|beinsports|supersport|fifa)\./i;
  const STREAM = /(stream|watch|live|soccer|football|sport)/i;
  if (!host) return "off";
  if (LEGIT.test(host)) return "light";
  if (STREAM.test(host)) return "strict";
  return "off";
}

function applyState({ tab, counters, settings }) {
  lastSettings = settings;
  els.enabled.checked = !!settings.enabled;
  const host = tab ? hostFromUrl(tab.url) : "—";
  els.host.textContent = host;
  const mode = renderMode(host);
  els.modeTag.textContent = mode;
  els.modeDot.className = "cs-dot " + (mode === "off" ? "" : mode === "strict" ? "strict" : "on");
  els.popups.textContent = counters?.popups || 0;
  els.fakebtns.textContent = counters?.fakeButtons || 0;
  els.overlays.textContent = counters?.overlays || 0;
  const lt = settings.lifetime || { popups: 0, fakeButtons: 0, overlays: 0 };
  els.lifetime.textContent = `${lt.popups} popups · ${lt.fakeButtons} fake buttons · ${lt.overlays} overlays`;
  document.querySelectorAll("input[data-key]").forEach((input) => {
    const k = input.dataset.key;
    input.checked = settings[k] !== false;
  });
  renderPremiumCard(settings.tier === "premium");
}

function renderPremiumCard(isPremium) {
  const card = document.getElementById("cs-premium-card");
  if (!card) return;
  const row = card.querySelector(".cs-premium-row");
  if (!row) return;
  if (isPremium) {
    row.innerHTML =
      '<span class="cs-premium-badge">PREMIUM</span><span>Active — custom filters and prayer-aware silence enabled.</span>';
  } else {
    row.innerHTML =
      '<span class="cs-premium-badge">PREMIUM</span><span>Coming soon — custom filter lists, prayer-aware silence, multi-device sync.</span>';
  }
}

async function saveDelta(patch) {
  const next = { ...(lastSettings || {}), ...patch };
  await chrome.runtime.sendMessage({ type: "cs:setSettings", settings: next });
  lastSettings = next;
}

els.enabled.addEventListener("change", (e) => saveDelta({ enabled: e.target.checked }));

document.querySelectorAll("input[data-key]").forEach((input) => {
  input.addEventListener("change", (e) => saveDelta({ [e.target.dataset.key]: e.target.checked }));
});

els.options.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

port.onMessage.addListener((msg) => {
  if (msg.type === "active") applyState(msg);
});
port.postMessage({ type: "getActive" });

// Re-poll while popup is open so the per-tab counter ticks live.
const poll = setInterval(() => port.postMessage({ type: "getActive" }), 800);
window.addEventListener("unload", () => clearInterval(poll));
