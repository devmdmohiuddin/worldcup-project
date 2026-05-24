// Settings model. Stored in chrome.storage.sync so users get a consistent
// experience across devices signed into the same Chrome profile.

const KEY = "cleanStreamSettings";

export function defaults() {
  return {
    enabled: true,
    tier: "free", // 'free' | 'premium'
    blockAdult: true,
    blockGambling: true,
    blockMalware: true,
    blockPopups: true,
    blockFakeButtons: true,
    blockOverlays: true,
    perSiteOverrides: {}, // host -> 'allow' | 'block'
    lifetime: { popups: 0, fakeButtons: 0, overlays: 0 },
    installedAt: Date.now(),
  };
}

export async function loadSettings() {
  try {
    const { [KEY]: stored } = await chrome.storage.sync.get(KEY);
    return { ...defaults(), ...(stored || {}) };
  } catch (_) {
    const { [KEY]: stored } = await chrome.storage.local.get(KEY);
    return { ...defaults(), ...(stored || {}) };
  }
}

export async function saveSettings(next) {
  const merged = { ...defaults(), ...next };
  try {
    await chrome.storage.sync.set({ [KEY]: merged });
  } catch (_) {
    await chrome.storage.local.set({ [KEY]: merged });
  }
  return merged;
}

// Premium gating. Premium is "future" per Sprint 5 — we expose the flag now
// so the UI can show preview affordances without unlocking anything.
// Reason this lives in settings: keeps the gate next to its state, so a single
// place decides which features get rendered as locked vs. live.
export function isPremium(settings) {
  return settings?.tier === "premium";
}
