import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientObservability } from "@/components/ClientObservability";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://footballclean.app";
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FootballClean — World Cup 2026, the clean way",
    template: "%s · FootballClean",
  },
  description:
    "The cleanest way to follow the FIFA World Cup 2026 — full schedule, live scores, and where to watch every match legally in your country. No gambling, no piracy.",
  applicationName: "FootballClean",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "FootballClean",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "FootballClean",
    url: SITE_URL,
    title: "FootballClean — World Cup 2026, the clean way",
    description:
      "Full schedule, live scores, and legal streams for every World Cup 2026 match. No gambling, no piracy.",
    images: ["/og.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FootballClean — World Cup 2026, the clean way",
    description:
      "Full schedule, live scores, and legal streams for every World Cup 2026 match.",
    images: ["/og.svg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.aladhan.com" />
        {PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <ClientObservability />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var m = document.cookie.match(/(?:^|;\\s*)fc_locale=([^;]+)/);
                  if (m) {
                    var code = decodeURIComponent(m[1]);
                    document.documentElement.lang = code;
                    document.documentElement.dir = (code === 'ar' || code === 'ur') ? 'rtl' : 'ltr';
                  }
                } catch (e) {}
              })();
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
