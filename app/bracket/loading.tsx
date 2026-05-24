import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/Skeleton";

export default function BracketLoading() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-3.5rem)]">
        <section className="container-page space-y-6 py-6">
          <Skeleton className="h-8 w-64" label="Loading bracket" />
          <div className="space-y-8" aria-busy="true">
            {Array.from({ length: 4 }).map((_, round) => (
              <div key={round}>
                <Skeleton className="mb-3 h-4 w-32" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((__, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
