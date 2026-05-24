/**
 * Pluggable cache for upstream API responses.
 *
 * The default in-memory implementation is per-process and survives only as
 * long as the Node runtime. To swap in Upstash Redis without touching call
 * sites, implement the `Cache` interface against `@upstash/redis` and set it
 * via `setCache()` during boot (e.g. in a route's module scope).
 */
export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

interface MemoryEntry {
  value: unknown;
  expiresAt: number;
}

class MemoryCache implements Cache {
  private store = new Map<string, MemoryEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}

let activeCache: Cache = new MemoryCache();

export function getCache(): Cache {
  return activeCache;
}

export function setCache(cache: Cache): void {
  activeCache = cache;
}
