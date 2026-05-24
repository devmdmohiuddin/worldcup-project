import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/Skeleton";

export default function MatchLoading() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-3.5rem)]">
        <section className="container-page space-y-6 py-6">
          <Skeleton className="h-4 w-32" label="Loading match" />
          <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <Skeleton className="h-8" />
              <Skeleton className="mx-auto h-12 w-24" />
              <Skeleton className="h-8" />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </section>
      </main>
      <Footer />
    </>
  );
}
