import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScheduleView } from "@/components/ScheduleView";
import { getGroupStageMatches } from "@/lib/fixtures";

export default function HomePage() {
  const matches = getGroupStageMatches();
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <ScheduleView matches={matches} />
      </main>
      <Footer />
    </>
  );
}
