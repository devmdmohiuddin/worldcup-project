/**
 * Web Push helpers — VAPID-based subscription bookkeeping.
 *
 * Storage is intentionally pluggable. The default in-memory store is for local
 * dev. Production should swap it for Redis/Postgres via `setPushStore()`.
 *
 * The actual notification send isn't done here: this app sends from the bot
 * worker (Sprint 6) and an upcoming serverless cron. This file owns the
 * subscription lifecycle and the helpers both sides share.
 */

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  /** What the user opted in to. Empty array = subscribed but muted. */
  topics: PushTopic[];
  /** Optional team slot (e.g. "A1") for goal alerts. */
  favoriteTeamSlot?: string;
  /** Stable client id so the same browser can update its prefs without dupes. */
  clientId: string;
  /** Locale to send notifications in; defaults to "en". */
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export type PushTopic = "goals" | "match-start" | "prayer-reminders";

export const PUSH_TOPICS: PushTopic[] = ["goals", "match-start", "prayer-reminders"];

export interface PushStore {
  upsert(record: PushSubscriptionRecord): Promise<void>;
  removeByEndpoint(endpoint: string): Promise<void>;
  listByTopic(topic: PushTopic): Promise<PushSubscriptionRecord[]>;
  getByClientId(clientId: string): Promise<PushSubscriptionRecord | null>;
}

class MemoryPushStore implements PushStore {
  private byEndpoint = new Map<string, PushSubscriptionRecord>();
  private byClientId = new Map<string, string>();

  async upsert(record: PushSubscriptionRecord): Promise<void> {
    this.byEndpoint.set(record.endpoint, record);
    this.byClientId.set(record.clientId, record.endpoint);
  }

  async removeByEndpoint(endpoint: string): Promise<void> {
    const rec = this.byEndpoint.get(endpoint);
    if (rec) this.byClientId.delete(rec.clientId);
    this.byEndpoint.delete(endpoint);
  }

  async listByTopic(topic: PushTopic): Promise<PushSubscriptionRecord[]> {
    return Array.from(this.byEndpoint.values()).filter((r) => r.topics.includes(topic));
  }

  async getByClientId(clientId: string): Promise<PushSubscriptionRecord | null> {
    const ep = this.byClientId.get(clientId);
    if (!ep) return null;
    return this.byEndpoint.get(ep) ?? null;
  }
}

let store: PushStore = new MemoryPushStore();

export function getPushStore(): PushStore {
  return store;
}

export function setPushStore(next: PushStore): void {
  store = next;
}

/** Public VAPID key, used by the browser to subscribe. Empty string disables push. */
export function getPublicVapidKey(): string {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
}
