const TOGGLE_KEYS = [
  "blockAdult",
  "blockGambling",
  "blockMalware",
  "blockPopups",
  "blockFakeButtons",
  "blockOverlays",
];

const els = {
  enabled: document.getElementById("enabled"),
  host: document.getElementById("host"),
  mode: document.getElementById("mode"),
  add: document.getElementById("add"),
  overrides: document.getElementById("overrides"),
  lifetime: document.getElementById("lifetime"),
  reset: document.getElementById("reset"),
  learn: document.getElementById("learn"),
};

let settings = null;

async function load() {
  const res = await chrome.runtime.sendMessage({ type: "cs:getState" });
  settings = res.settings;
  els.enabled.checked = !!settings.enabled;
  TOGGLE_KEYS.forEach((k) => {
    const input = document.querySelector(`input[data-key="${k}"]`);
    if (input) input.checked = settings[k] !== false;
  });
  renderOverrides();
  renderLifetime();
}

async function save() {
  await chrome.runtime.sendMessage({ type: "cs:setSettings", settings });
}

function renderOverrides() {
  els.overrides.innerHTML = "";
  const entries = Object.entries(settings.perSiteOverrides || {});
  if (!entries.length) {
    els.overrides.innerHTML = `<li style="opacity:.6">No overrides yet.</li>`;
    return;
  }
  entries.forEach(([host, mode]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span><strong>${host}</strong> — <em>${mode}</em></span><button data-host="${host}">remove</button>`;
    els.overrides.appendChild(li);
  });
  els.overrides.querySelectorAll("button[data-host]").forEach((b) =>
    b.addEventListener("click", async () => {
      delete settings.perSiteOverrides[b.dataset.host];
      await save();
      renderOverrides();
    }),
  );
}

function renderLifetime() {
  const lt = settings.lifetime || { popups: 0, fakeButtons: 0, overlays: 0 };
  els.lifetime.textContent = `Blocked since install: ${lt.popups} popups, ${lt.fakeButtons} fake buttons, ${lt.overlays} overlays.`;
}

els.enabled.addEventListener("change", async (e) => {
  settings.enabled = e.target.checked;
  await save();
});

TOGGLE_KEYS.forEach((k) => {
  const input = document.querySelector(`input[data-key="${k}"]`);
  input.addEventListener("change", async (e) => {
    settings[k] = e.target.checked;
    await save();
  });
});

els.add.addEventListener("click", async () => {
  const host = (els.host.value || "").trim().toLowerCase().replace(/^https?:\/\//, "");
  if (!host) return;
  settings.perSiteOverrides = settings.perSiteOverrides || {};
  settings.perSiteOverrides[host] = els.mode.value;
  await save();
  els.host.value = "";
  renderOverrides();
});

els.reset.addEventListener("click", async () => {
  if (!confirm("Reset lifetime block counters?")) return;
  settings.lifetime = { popups: 0, fakeButtons: 0, overlays: 0 };
  await save();
  renderLifetime();
});

els.learn.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://footballclean.com/premium" });
});

load();
