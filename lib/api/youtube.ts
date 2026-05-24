/**
 * YouTube Data API v3 wrapper.
 *
 * Free-tier quota: 10,000 units/day. A search.list call costs 100 units, so we
 * cache aggressively (per-query, 24h) and refuse to call upstream when the key
 * is missing — callers fall back to the curated seed list.
 *
 * We only ever surface videos uploaded by channels in `highlight_channels.json`
 * (the "official broadcaster allow-list"). This keeps the experience halal:
 * no pirated rips, no betting-sponsor overlays, no random fan uploads.
 */
import { getCache } from "@/lib/cache";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const DEFAULT_TTL = 24 * 60 * 60; // 24h — highlights don't change once uploaded

export interface YtSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

interface YtSearchResponse {
  items: YtSearchItem[];
}

interface SearchOptions {
  query: string;
  /** Restrict to videos uploaded by this channel id. */
  channelId: string;
  /** Only videos published after this ISO timestamp (RFC 3339). */
  publishedAfter?: string;
  /** Max results, default 5. */
  max?: number;
}

/**
 * Search YouTube for highlight videos in a single official channel.
 * Returns `null` when the API key is missing — caller should fall back.
 */
export async function ytSearch(opts: SearchOptions): Promise<YtSearchItem[] | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  const cache = getCache();
  const cacheKey = `yt:search:${opts.channelId}:${opts.query}:${opts.publishedAfter ?? ""}`;
  const cached = await cache.get<YtSearchItem[]>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    channelId: opts.channelId,
    q: opts.query,
    maxResults: String(opts.max ?? 5),
    order: "relevance",
    safeSearch: "strict",
    videoEmbeddable: "true",
    key,
  });
  if (opts.publishedAfter) params.set("publishedAfter", opts.publishedAfter);

  try {
    const res = await fetch(`${BASE_URL}/search?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as YtSearchResponse;
    const items = json.items ?? [];
    await cache.set(cacheKey, items, DEFAULT_TTL);
    return items;
  } catch {
    return null;
  }
}

export function bestThumbnail(item: YtSearchItem): string {
  const t = item.snippet.thumbnails;
  return (
    t.high?.url ??
    t.medium?.url ??
    t.default?.url ??
    `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`
  );
}
