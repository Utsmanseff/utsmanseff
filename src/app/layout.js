import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// Named ViewTransition, not unstable_ViewTransition: with
// experimental.viewTransition on, Next swaps the app's React for a canary build
// (19.3.0-canary) whose export dropped the prefix. Measured, not assumed.
//
// This boundary is what makes the move between / and /sistem animate at all.
// React calls startViewTransition itself once the new tree is ready; doing it by
// hand around router.push captures the old DOM twice.
import { ViewTransition } from "react";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";
import { meta } from "@/lib/data/meta";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});


export const metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: {
    default: "Utsman — Fullstack Web Developer",
    template: "%s — Utsman",
  },
  description:
    "Utsman — fullstack web developer di Banjarbaru, Kalimantan Selatan. Portofolio project dan cara menghubungi.",
  keywords: [
    "Utsman",
    "Fullstack Web Developer",
    "Web Developer Banjarbaru",
    "Laravel",
    "Next.js",
    "Banjarbaru",
    "Kalimantan Selatan",
  ],
  authors: [{ name: "Utsman" }],
  creator: "Utsman",
  openGraph: {
    title: "Utsman — Fullstack Web Developer",
    description:
      "Portofolio Utsman, fullstack web developer di Banjarbaru, Kalimantan Selatan.",
    url: "/",
    siteName: "Utsman",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utsman — Fullstack Web Developer",
    description:
      "Portofolio Utsman, fullstack web developer di Banjarbaru, Kalimantan Selatan.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-body`}
      >
        <noscript>
          <style>{`[data-fade]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <JsonLd />
        <ViewTransition>
          <Providers>{children}</Providers>
        </ViewTransition>
      </body>
    </html>
  );
}
