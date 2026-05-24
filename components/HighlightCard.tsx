"use client";

import type { Highlight } from "@/lib/types";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface Props {
  highlight: Highlight;
}

export function HighlightCard({ highlight }: Props) {
  const published = formatPublished(highlight.publishedAt);
  return (
    <article className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/60">
      <YouTubeEmbed
        videoId={highlight.videoId}
        title={highlight.title}
        thumbnail={highlight.thumbnail}
        compact
      />
      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-ink-100" title={highlight.title}>
          {highlight.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-ink-500">
          <span className="truncate text-ink-400">{highlight.channelName}</span>
          <span suppressHydrationWarning>{published}</span>
        </div>
      </div>
    </article>
  );
}

function formatPublished(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
