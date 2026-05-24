import { promises as fs } from "node:fs";
import path from "node:path";
import type { LangCode } from "../i18n/index.js";

export interface UserPrefs {
  chatId: number;
  language: LangCode;
  favoriteTeamSlot: string | null;
  goalAlerts: boolean;
  dailyDigest: boolean;
}

interface UsersFile {
  users: Record<string, UserPrefs>;
}

/**
 * Simple JSON-backed user store. Good enough for free-tier launch (a few
 * thousand users at most). For larger scale, swap the backend to Redis or
 * Postgres by implementing the same async surface.
 */
export class UserStore {
  private cache: Map<number, UserPrefs> = new Map();
  private loaded = false;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(private filePath: string) {}

  private async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      const parsed = JSON.parse(raw) as UsersFile;
      for (const u of Object.values(parsed.users ?? {})) {
        this.cache.set(u.chatId, u);
      }
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error("[storage] failed to read users file:", err);
      }
    }
    this.loaded = true;
  }

  private async persist(): Promise<void> {
    const data: UsersFile = { users: {} };
    for (const u of this.cache.values()) data.users[u.chatId] = u;
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  private schedulePersist(): void {
    this.writeQueue = this.writeQueue.then(() => this.persist()).catch((err) => {
      console.error("[storage] persist failed:", err);
    });
  }

  async get(chatId: number): Promise<UserPrefs | null> {
    await this.load();
    return this.cache.get(chatId) ?? null;
  }

  async upsert(chatId: number, patch: Partial<UserPrefs>): Promise<UserPrefs> {
    await this.load();
    const existing = this.cache.get(chatId) ?? {
      chatId,
      language: "en" as LangCode,
      favoriteTeamSlot: null,
      goalAlerts: true,
      dailyDigest: true,
    };
    const next: UserPrefs = { ...existing, ...patch, chatId };
    this.cache.set(chatId, next);
    this.schedulePersist();
    return next;
  }

  async all(): Promise<UserPrefs[]> {
    await this.load();
    return Array.from(this.cache.values());
  }
}
