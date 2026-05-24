import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HighlightsView } from "@/components/HighlightsView";
import { getBestGoals, listAllHighlights, getOfficialChannels } from "@/lib/api/highlights";
import { allTeams } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Highlights",
  description:
    "Official FIFA World Cup 2026 match highlights from FIFA, FOX Soccer, BBC Sport, DAZN and other licensed broadcasters.",
};

export const dynamic = "force-dynamic";

export default async function HighlightsPage() {
  const [highlights, bestGoals] = await Promise.all([
    listAllHighlights(),
    Promise.resolve(getBestGoals()),
  ]);

  const channels = getOfficialChannels();
  const teamOptions = Array.from(
    new Set(
      allTeams()
        .map((t) => t.name)
        .filter((n) => !n.startsWith("TBD")),
    ),
  ).sort();

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-3.5rem)]">
        <section className="container-page space-y-6 py-6">
          <header>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Highlights</h1>
            <p className="mt-1 max-w-2xl text-sm text-ink-400">
              Official video from licensed broadcasters only — uploaded post-match by{" "}
              {channels.map((c, i) => (
                <span key={c.channelId}>
                  <span className="text-ink-200">{c.name}</span>
                  {i < channels.length - 1 ? ", " : ""}
                </span>
              ))}
              . No pirated streams, no ads from gambling partners.
            </p>
          </header>

          <HighlightsView
            initialHighlights={highlights}
            bestGoals={bestGoals}
            teamOptions={teamOptions}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
