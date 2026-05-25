import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  description: "We couldn't find that page on MatchHub.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12 text-center"
      >
        <p className="font-mono text-6xl font-bold tabular-nums text-pitch-500">404</p>
        <h1 className="text-2xl font-bold tracking-tight">Off the pitch.</h1>
        <p className="max-w-md text-sm text-ink-400">
          That page doesn&apos;t exist — maybe the match was rescheduled, or the link is stale.
        </p>
        <div className="flex gap-2">
          <Link href="/" className="btn-primary">
            Back to schedule
          </Link>
          <Link href="/highlights" className="btn">
            Browse highlights
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
