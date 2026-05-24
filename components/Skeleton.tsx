import { clsx } from "@/lib/clsx";

interface Props {
  className?: string;
  /** Accessible label exposed to screen readers — defaults to "Loading". */
  label?: string;
}

export function Skeleton({ className, label = "Loading" }: Props) {
  return (
    <div
      role="status"
      aria-label={label}
      className={clsx(
        "animate-pulse rounded-md bg-ink-800/70",
        "motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export function MatchCardSkeleton() {
  return (
    <div
      aria-hidden
      className="rounded-xl border border-ink-800 bg-ink-900/40 p-4"
      data-testid="match-card-skeleton"
    >
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="mt-3 border-t border-ink-800 pt-2">
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function MatchGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      <span className="sr-only" role="status">
        Loading matches…
      </span>
      {Array.from({ length: count }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StandingsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      <span className="sr-only" role="status">
        Loading standings…
      </span>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-ink-800 bg-ink-900/40 p-3"
        >
          <Skeleton className="mb-3 h-4 w-16" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((__, j) => (
              <Skeleton key={j} className="h-6 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HighlightCardSkeleton() {
  return (
    <div aria-hidden className="overflow-hidden rounded-xl border border-ink-800 bg-ink-900/40">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function HighlightsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      <span className="sr-only" role="status">
        Loading highlights…
      </span>
      {Array.from({ length: count }).map((_, i) => (
        <HighlightCardSkeleton key={i} />
      ))}
    </div>
  );
}
