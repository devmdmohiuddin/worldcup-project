import type { MatchStatus } from "@/lib/types";

interface Props {
  status: MatchStatus;
  minute?: number | null;
}

export function LiveBadge({ status, minute }: Props) {
  if (status !== "live" && status !== "half-time") return null;
  const label = status === "half-time" ? "HT" : minute != null ? `${minute}'` : "LIVE";
  return (
    <span
      className="chip-live inline-flex items-center gap-1.5"
      role="status"
      aria-label={status === "half-time" ? "Half-time" : `Live, minute ${minute ?? "unknown"}`}
    >
      <span className="relative inline-flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      <span className="font-semibold tabular-nums">{label}</span>
    </span>
  );
}
