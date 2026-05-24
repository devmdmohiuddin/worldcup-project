import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HighlightsGridSkeleton, Skeleton } from "@/components/Skeleton";

export default function HighlightsLoading() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-3.5rem)]">
        <section className="container-page space-y-6 py-6">
          <Skeleton className="h-8 w-48" label="Loading highlights" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <HighlightsGridSkeleton />
        </section>
      </main>
      <Footer />
    </>
  );
}
