"use client";

import { useCallback, useEffect, useState } from "react";
import { PUSH_TOPICS, type PushTopic } from "@/lib/push";

const LS_CLIENT_ID = "fc_push_client_id";
const LS_TOPICS = "fc_push_topics";
const LS_FAVORITE_TEAM = "fc_favorite_team";

type Permission = "default" | "granted" | "denied" | "unsupported";

export interface PushPrefs {
  topics: PushTopic[];
  favoriteTeamSlot?: string;
}

interface State {
  permission: Permission;
  supported: boolean;
  subscribed: boolean;
  loading: boolean;
  error: string | null;
  prefs: PushPrefs;
}

function readPrefs(): PushPrefs {
  if (typeof window === "undefined") return { topics: [] };
  const raw = localStorage.getItem(LS_TOPICS);
  const topics = raw
    ? (raw.split(",").filter((t) => PUSH_TOPICS.includes(t as PushTopic)) as PushTopic[])
    : [];
  const favoriteTeamSlot = localStorage.getItem(LS_FAVORITE_TEAM) ?? undefined;
  return { topics, favoriteTeamSlot };
}

function writePrefs(prefs: PushPrefs) {
  localStorage.setItem(LS_TOPICS, prefs.topics.join(","));
  if (prefs.favoriteTeamSlot) {
    localStorage.setItem(LS_FAVORITE_TEAM, prefs.favoriteTeamSlot);
  } else {
    localStorage.removeItem(LS_FAVORITE_TEAM);
  }
}

function getClientId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(LS_CLIENT_ID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(LS_CLIENT_ID, id);
  }
  return id;
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function usePushSubscription(locale: string) {
  const [state, setState] = useState<State>({
    permission: "default",
    supported: false,
    subscribed: false,
    loading: true,
    error: null,
    prefs: { topics: [] },
  });

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    if (!supported) {
      setState((s) => ({ ...s, supported: false, permission: "unsupported", loading: false }));
      return;
    }
    const prefs = readPrefs();
    const permission = Notification.permission as Permission;
    setState((s) => ({ ...s, supported: true, permission, prefs }));

    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        setState((s) => ({ ...s, subscribed: !!sub, loading: false }));
      })
      .catch(() => setState((s) => ({ ...s, loading: false })));
  }, []);

  const subscribe = useCallback(
    async (next: PushPrefs) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setState((s) => ({ ...s, permission: permission as Permission, loading: false }));
          return;
        }
        const vapidRes = await fetch("/api/push/vapid").then((r) => r.json());
        const publicKey: string = vapidRes.publicKey;
        if (!publicKey) {
          throw new Error("Server is missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
        }
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        const sub =
          existing ??
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          }));

        const json = sub.toJSON() as {
          endpoint: string;
          keys?: { p256dh?: string; auth?: string };
        };
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: getClientId(),
            endpoint: json.endpoint,
            keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
            topics: next.topics,
            favoriteTeamSlot: next.favoriteTeamSlot,
            locale,
          }),
        });
        writePrefs(next);
        setState((s) => ({
          ...s,
          permission: "granted",
          subscribed: true,
          prefs: next,
          loading: false,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to subscribe";
        setState((s) => ({ ...s, error: message, loading: false }));
      }
    },
    [locale],
  );

  const updatePrefs = useCallback(
    async (next: PushPrefs) => {
      writePrefs(next);
      setState((s) => ({ ...s, prefs: next }));
      if (!state.subscribed) return;
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (!sub) return;
        const json = sub.toJSON() as {
          endpoint: string;
          keys?: { p256dh?: string; auth?: string };
        };
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: getClientId(),
            endpoint: json.endpoint,
            keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
            topics: next.topics,
            favoriteTeamSlot: next.favoriteTeamSlot,
            locale,
          }),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update prefs";
        setState((s) => ({ ...s, error: message }));
      }
    },
    [locale, state.subscribed],
  );

  const unsubscribe = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState((s) => ({ ...s, subscribed: false, loading: false }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to unsubscribe";
      setState((s) => ({ ...s, error: message, loading: false }));
    }
  }, []);

  return { ...state, subscribe, unsubscribe, updatePrefs };
}
