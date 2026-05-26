import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchGridSkeleton, Skeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-3.5rem)]">
        <section className="container-page py-6">
          <Skeleton className="mb-2 h-8 w-2/3 max-w-md" label="Loading fixtures" />
          <Skeleton className="mb-6 h-4 w-1/2 max-w-sm" />
          <div className="mb-6 rounded-xl border border-ink-800 bg-ink-900/40 p-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <MatchGridSkeleton count={9} />
        </section>
      </main>
      <Footer />
    </>
  );
}
