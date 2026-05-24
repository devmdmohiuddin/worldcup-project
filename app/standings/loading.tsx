import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StandingsSkeleton, Skeleton } from "@/components/Skeleton";

export default function StandingsLoading() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-3.5rem)]">
        <section className="container-page py-6">
          <Skeleton className="mb-2 h-8 w-64" label="Loading group standings" />
          <Skeleton className="mb-6 h-4 w-80" />
          <StandingsSkeleton />
        </section>
      </main>
      <Footer />
    </>
  );
}
