"use client";

import { useState } from "react";

interface Props {
  videoId: string;
  title: string;
  thumbnail: string;
  /** Smaller card variant used in list grids. */
  compact?: boolean;
}

/**
 * Click-to-load YouTube embed. The iframe (and its ~700KB of player JS) only
 * mounts after the user clicks Play — until then we show the thumbnail. This
 * keeps the highlights page fast even with dozens of videos on screen.
 *
 * We use `youtube-nocookie.com` so we don't drop tracking cookies on the user
 * before they ask to watch — matches the "clean" posture of the site.
 */
export function YouTubeEmbed({ videoId, title, thumbnail, compact = false }: Props) {
  const [playing, setPlaying] = useState(false);

  const aspect = compact ? "aspect-video" : "aspect-video";

  if (playing) {
    return (
      <div className={`relative w-full overflow-hidden rounded-xl bg-black ${aspect}`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerated-2d-canvas; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`group relative w-full overflow-hidden rounded-xl bg-black ${aspect}`}
      aria-label={`Play ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt=""
        loading="lazy"
        decoding="async"
        width={480}
        height={270}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-pitch-600/90 text-white shadow-lg transition-transform group-hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6">
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </span>
    </button>
  );
}
