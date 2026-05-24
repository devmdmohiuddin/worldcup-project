/**
 * Highlights service.
 *
 * Public flow:
 *   1. `getHighlightsForMatch(matchId)` — only resolves once the upstream live
 *      feed reports the match as FINISHED. Returns the first match found in
 *      our official-channel allow-list, scored by query specificity.
 *   2. `listAllHighlights()` — merges curated seed videos with any live-fetched
 *      match clips; used by the /highlights page.
 *   3. `getBestGoals()` — static curated reel (the "best of the tournament").
 *
 * Halal posture: every video that reaches the UI originates from a channel id
 * present in `highlight_channels.json`. We do not search across YouTube at
 * large — that's what keeps gambling overlays and pirated rips out.
 */
import channelsData from "@/data/highlight_channels.json";
import seedsData from "@/data/highlight_seeds.json";
import type { Highlight, HighlightChannel } from "@/lib/types";
import { getGroupStageMatches } from "@/lib/fixtures";
import { resolveSlot } from "@/lib/teams";
import { getLiveMatch } from "./liveMatches";
import { bestThumbnail, ytSearch, type YtSearchItem } from "./youtube";

const CHANNELS: HighlightChannel[] = (channelsData as { channels: HighlightChannel[] }).channels;

const BEST_GOALS: Highlight[] = (seedsData as { bestGoals: Highlight[] }).bestGoals;

const CHANNEL_IDS = new Set(CHANNELS.map((c) => c.channelId));

function ytItemToHighlight(
  item: YtSearchItem,
  extras: Pick<Highlight, "matchId" | "tags" | "kind">,
): Highlight {
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    channelId: item.snippet.channelId,
    channelName: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnail: bestThumbnail(item),
    ...extras,
  };
}

/**
 * Fetch highlights for a single match. Returns `[]` until the match is over —
 * we don't want to surface half-time clips or pre-match analysis videos.
 */
export async function getHighlightsForMatch(matchId: string): Promise<Highlight[]> {
  const match = getGroupStageMatches().find((m) => m.id === matchId);
  if (!match) return [];

  // Gate on full-time. Without an API-driven status we'd post highlights for
  // matches that haven't happened yet, confusing users with stale 2022 clips.
  const live = await getLiveMatch(matchId).catch(() => null);
  if (!live || live.status !== "finished") return [];

  const home = resolveSlot(match.homeSlot);
  const away = resolveSlot(match.awaySlot);
  if (home.startsWith("TBD") || away.startsWith("TBD")) return [];

  // Search each official channel in parallel. publishedAfter trims results to
  // videos uploaded within 48h of kickoff — handles channels that reuse "X vs Y"
  // titles across tournaments.
  const kickoff = new Date(match.kickoffUTC).getTime();
  const publishedAfter = new Date(kickoff - 6 * 60 * 60 * 1000).toISOString();
  const query = `${home} vs ${away} highlights`;

  const results = await Promise.all(
    CHANNELS.map((c) =>
      ytSearch({ channelId: c.channelId, query, publishedAfter, max: 3 }),
    ),
  );

  const highlights: Highlight[] = [];
  for (const items of results) {
    if (!items) continue;
    for (const item of items) {
      if (!CHANNEL_IDS.has(item.snippet.channelId)) continue;
      highlights.push(
        ytItemToHighlight(item, {
          matchId,
          tags: [home, away, "match", `group-${match.group}`],
          kind: "match",
        }),
      );
    }
  }

  // Newest first — broadcasters typically upload the full highlight reel last.
  highlights.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return highlights;
}

/**
 * Aggregate all known highlights — curated seed reel plus any per-match clips
 * already cached from prior `getHighlightsForMatch` calls. We don't proactively
 * scan all 72 fixtures here to keep API quota usage low; matches you visit get
 * their clips pulled in on demand and are returned by future `listAll` calls
 * via the cache layer that backs `ytSearch`.
 */
export async function listAllHighlights(): Promise<Highlight[]> {
  const all: Highlight[] = [...BEST_GOALS];

  // Restrict to matches whose scheduled kickoff has already passed — anything
  // in the future can't possibly have highlights yet. getHighlightsForMatch
  // further gates on live status === "finished".
  const now = Date.now();
  const candidates = getGroupStageMatches().filter(
    (m) => Date.parse(m.kickoffUTC) < now,
  );

  // Sequential to avoid bursting the YouTube quota — these are cache hits in
  // steady state, so latency is mostly local.
  for (const m of candidates) {
    const matchHighlights = await getHighlightsForMatch(m.id);
    all.push(...matchHighlights);
  }

  return dedupeByVideoId(all);
}

export function getBestGoals(): Highlight[] {
  return BEST_GOALS;
}

export function getOfficialChannels(): HighlightChannel[] {
  return CHANNELS;
}

function dedupeByVideoId(list: Highlight[]): Highlight[] {
  const seen = new Set<string>();
  const out: Highlight[] = [];
  for (const h of list) {
    if (seen.has(h.videoId)) continue;
    seen.add(h.videoId);
    out.push(h);
  }
  return out;
}
