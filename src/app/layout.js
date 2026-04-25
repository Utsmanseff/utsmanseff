import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://utsman.dev"),
  title: {
    default: "Utsman — Fullstack Web Developer",
    template: "%s — Utsman",
  },
  description:
    "Fullstack web developer berbasis di Banjarbaru. Fokus teknologi kesehatan: RME, integrasi BPJS, dan pendaftaran OCR rumah sakit.",
  keywords: [
    "Utsman",
    "Fullstack Web Developer",
    "Laravel",
    "Next.js",
    "Healthcare technology",
    "RME",
    "BPJS bridging",
    "OCR",
    "Banjarbaru",
  ],
  authors: [{ name: "Utsman" }],
  creator: "Utsman",
  openGraph: {
    title: "Utsman — Fullstack Web Developer",
    description:
      "Solving real problems with software that feels effortless to use. Healthtech focus: EMR, BPJS bridging, OCR.",
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
      "Solving real problems with software that feels effortless to use.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-body`}
      >
        <JsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
