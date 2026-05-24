import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Bracket } from "@/components/Bracket";

export const metadata: Metadata = {
  title: "Knockout bracket",
  description: "World Cup 2026 knockout bracket — Round of 32 through to the Final.",
};

export default function BracketPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <section className="container-page py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Knockout bracket</h1>
            <p className="mt-1 text-sm text-ink-400">
              Placeholders resolve to real teams as the group stage completes.
            </p>
          </div>
          <Bracket />
        </section>
      </main>
      <Footer />
    </>
  );
}
