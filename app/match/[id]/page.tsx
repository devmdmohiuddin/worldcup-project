import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchDetail } from "@/components/MatchDetail";
import { getGroupStageMatches } from "@/lib/fixtures";
import { getDynamicMatches } from "@/lib/api/fixtureSync";
import { resolveSlot } from "@/lib/teams";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Reuse the hourly cache window the home page uses.
export const revalidate = 3600;

export async function generateStaticParams() {
  // generateStaticParams runs at build time before any env-driven source is
  // configured; use the static list as the canonical structure.
  return getGroupStageMatches().map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const all = await getDynamicMatches();
  const match = all.find((m) => m.id === id);
  if (!match) return { title: "Match not found" };
  const home = resolveSlot(match.homeSlot);
  const away = resolveSlot(match.awaySlot);
  return {
    title: `${home} vs ${away} — Group ${match.group}`,
    description: `${home} vs ${away} · World Cup 2026 · ${match.venue.stadium}, ${match.venue.city}.`,
  };
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const all = await getDynamicMatches();
  const match = all.find((m) => m.id === id);
  if (!match) notFound();
  const relatedMatches = match.group
    ? all.filter((m) => m.group === match.group && m.id !== match.id)
    : [];
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-3.5rem)]">
        <MatchDetail match={match} relatedMatches={relatedMatches} />
      </main>
      <Footer />
    </>
  );
}
