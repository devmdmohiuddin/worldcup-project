"use client";

import { useMemo, useState } from "react";
import { usePushSubscription } from "@/lib/hooks/usePushSubscription";
import { useLocale } from "@/lib/hooks/useLocale";
import { allTeams } from "@/lib/teams";
import { PUSH_TOPICS, type PushTopic } from "@/lib/push";
import type { TranslationKey } from "@/lib/i18n";

const TOPIC_LABELS: Record<PushTopic, TranslationKey> = {
  goals: "notifications.goalAlerts",
  "match-start": "notifications.matchStart",
};

export function NotificationPreferences() {
  const { locale, t } = useLocale();
  const {
    supported,
    permission,
    subscribed,
    loading,
    error,
    prefs,
    subscribe,
    unsubscribe,
    updatePrefs,
  } = usePushSubscription(locale);

  const [pendingTeam, setPendingTeam] = useState<string | undefined>(prefs.favoriteTeamSlot);

  const teams = useMemo(() => {
    return allTeams().sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  if (permission === "unsupported" || !supported) {
    return (
      <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-6 text-sm text-ink-400">
        {t("notifications.unsupported")}
      </div>
    );
  }

  function toggleTopic(topic: PushTopic, on: boolean) {
    const next = new Set(prefs.topics);
    if (on) next.add(topic);
    else next.delete(topic);
    updatePrefs({ topics: Array.from(next), favoriteTeamSlot: pendingTeam });
  }

  function pickTeam(slot: string) {
    const next = slot || undefined;
    setPendingTeam(next);
    updatePrefs({ topics: prefs.topics, favoriteTeamSlot: next });
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{t("notifications.title")}</h1>
        <p className="mt-1 text-sm text-ink-400">{t("notifications.subtitle")}</p>
      </header>

      {permission === "denied" && (
        <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 p-4 text-sm text-rose-200">
          {t("notifications.permissionDenied")}
        </div>
      )}

      <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-ink-100">
              {subscribed ? t("notifications.enabled") : t("notifications.enable")}
            </div>
          </div>
          {subscribed ? (
            <button
              type="button"
              onClick={unsubscribe}
              disabled={loading}
              className="rounded-md border border-ink-700 px-3 py-1.5 text-sm text-ink-200 hover:border-rose-500 hover:text-rose-300 disabled:opacity-50"
            >
              {t("notifications.disable")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => subscribe({ topics: prefs.topics, favoriteTeamSlot: pendingTeam })}
              disabled={loading || permission === "denied"}
              className="rounded-md bg-pitch-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-pitch-500 disabled:opacity-50"
            >
              {t("notifications.enable")}
            </button>
          )}
        </div>

        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

        <ul className="mt-5 space-y-3">
          {PUSH_TOPICS.map((topic) => (
            <li key={topic} className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-ink-200">
                <input
                  type="checkbox"
                  checked={prefs.topics.includes(topic)}
                  disabled={!subscribed && permission !== "granted"}
                  onChange={(e) => toggleTopic(topic, e.target.checked)}
                  className="h-4 w-4 rounded border-ink-700 bg-ink-950 text-pitch-500 focus:ring-pitch-500"
                />
                <span>{t(TOPIC_LABELS[topic])}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-ink-800 pt-4">
          <label className="flex flex-col gap-1 text-sm text-ink-200 sm:flex-row sm:items-center sm:justify-between">
            <span>{t("notifications.favoriteTeam")}</span>
            <select
              value={pendingTeam ?? ""}
              onChange={(e) => pickTeam(e.target.value)}
              className="rounded-md border border-ink-700 bg-ink-950 px-2 py-1 text-sm text-ink-100"
            >
              <option value="">{t("notifications.pickATeam")}</option>
              {teams.map((tm) => (
                <option key={tm.slot} value={tm.slot}>
                  {tm.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
