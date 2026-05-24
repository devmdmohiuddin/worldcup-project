import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchDetail } from "@/components/MatchDetail";
import { getGroupStageMatches } from "@/lib/fixtures";
import { resolveSlot } from "@/lib/teams";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getGroupStageMatches().map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const match = getGroupStageMatches().find((m) => m.id === id);
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
  const match = getGroupStageMatches().find((m) => m.id === id);
  if (!match) notFound();
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <MatchDetail match={match} />
      </main>
      <Footer />
    </>
  );
}
