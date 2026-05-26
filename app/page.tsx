import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LiveTicker } from "@/components/LiveTicker";
import { ScheduleView } from "@/components/ScheduleView";
import { getDynamicMatchesBundle } from "@/lib/api/fixtureSync";

// Revalidate the home page once an hour so the dynamic fixture overlay
// (remote kickoff times, draw-resolved team names) is refreshed without
// hammering the upstream source.
export const revalidate = 3600;

export default async function HomePage() {
  const bundle = await getDynamicMatchesBundle();
  return (
    <>
      <Header />
      <LiveTicker />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-3.5rem)]">
        <ScheduleView
          matches={bundle.matches}
          source={bundle.source}
          sourceLabel={bundle.sourceLabel}
        />
      </main>
      <Footer />
    </>
  );
}
