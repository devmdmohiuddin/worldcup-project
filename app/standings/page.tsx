import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StandingsTable } from "@/components/StandingsTable";

export const metadata: Metadata = {
  title: "Group standings",
  description: "Live World Cup 2026 group-stage standings, updated automatically.",
};

export default function StandingsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <section className="container-page py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Group standings</h1>
            <p className="mt-1 text-sm text-ink-400">
              Top two from each group advance, plus the eight best third-placed teams.
            </p>
          </div>
          <StandingsTable />
        </section>
      </main>
      <Footer />
    </>
  );
}
