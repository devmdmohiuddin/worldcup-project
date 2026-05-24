// MV3 service worker. Aggregates per-tab block counters, paints the badge,
// and exposes a small message API for the popup/options pages.
import { defaults, loadSettings, saveSettings } from "./settings.js";

const tabCounts = new Map(); // tabId -> { popups, fakeButtons, overlays }
const tabHosts = new Map(); // tabId -> hostname

const BADGE_COLOR_OK = "#0a7c2f";
const BADGE_COLOR_OFF = "#777777";

function totalFor(tabId) {
  const c = tabCounts.get(tabId);
  if (!c) return 0;
  return (c.popups || 0) + (c.fakeButtons || 0) + (c.overlays || 0);
}

async function paintBadge(tabId) {
  const settings = await loadSettings();
  const total = totalFor(tabId);
  const text = settings.enabled && total > 0 ? formatBadge(total) : "";
  try {
    await chrome.action.setBadgeText({ tabId, text });
    await chrome.action.setBadgeBackgroundColor({
      tabId,
      color: settings.enabled ? BADGE_COLOR_OK : BADGE_COLOR_OFF,
    });
  } catch (_) {
    /* tab may have closed */
  }
}

function formatBadge(n) {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1) + "k";
  return Math.round(n / 1000) + "k";
}

async function bumpLifetime(deltaCounts) {
  const settings = await loadSettings();
  settings.lifetime = settings.lifetime || {
    popups: 0,
    fakeButtons: 0,
    overlays: 0,
  };
  for (const k of ["popups", "fakeButtons", "overlays"]) {
    settings.lifetime[k] = (settings.lifetime[k] || 0) + (deltaCounts[k] || 0);
  }
  await saveSettings(settings);
}

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await loadSettings();
  await saveSettings({ ...defaults(), ...existing });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (!tabId) {
    if (msg?.type === "cs:getState") {
      (async () => {
        const settings = await loadSettings();
        sendResponse({ settings, perTab: null });
      })();
      return true;
    }
    if (msg?.type === "cs:setSettings") {
      (async () => {
        await saveSettings(msg.settings);
        sendResponse({ ok: true });
      })();
      return true;
    }
    return false;
  }

  if (msg?.type === "cs:active") {
    tabHosts.set(tabId, msg.host);
    paintBadge(tabId);
    return;
  }
  if (msg?.type === "cs:blocked") {
    const prev = tabCounts.get(tabId) || {
      popups: 0,
      fakeButtons: 0,
      overlays: 0,
    };
    const delta = {
      popups: (msg.counters.popups || 0) - (prev.popups || 0),
      fakeButtons: (msg.counters.fakeButtons || 0) - (prev.fakeButtons || 0),
      overlays: (msg.counters.overlays || 0) - (prev.overlays || 0),
    };
    tabCounts.set(tabId, { ...msg.counters });
    if (delta.popups || delta.fakeButtons || delta.overlays) {
      bumpLifetime(delta);
    }
    paintBadge(tabId);
    return;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabCounts.delete(tabId);
  tabHosts.delete(tabId);
});

chrome.tabs.onActivated.addListener(({ tabId }) => paintBadge(tabId));
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "loading") {
    tabCounts.delete(tabId);
    paintBadge(tabId);
  }
});

// Toggle the declarativeNetRequest rulesets when the user flips the master
// switch from the popup. We keep rule IDs in sync with manifest.json.
const RULESETS = ["adult_gambling_block", "malware_block", "popup_trackers"];

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "sync" && area !== "local") return;
  if (!changes.cleanStreamSettings) return;
  const next = changes.cleanStreamSettings.newValue || defaults();
  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: next.enabled ? RULESETS : [],
      disableRulesetIds: next.enabled ? [] : RULESETS,
    });
  } catch (_) {
    /* feature may be unavailable in some channels */
  }
});

// Popup needs a way to read per-tab counts. Use a port-style request.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "cs:popup") return;
  port.onMessage.addListener(async (msg) => {
    if (msg?.type === "getActive") {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const settings = await loadSettings();
      port.postMessage({
        type: "active",
        tab: tab ? { id: tab.id, url: tab.url, title: tab.title } : null,
        counters: tab
          ? tabCounts.get(tab.id) || {
              popups: 0,
              fakeButtons: 0,
              overlays: 0,
            }
          : null,
        settings,
      });
    }
  });
});
