import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";
import { meta } from "@/lib/data/meta";

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
  metadataBase: new URL(meta.siteUrl),
  title: {
    default: "Utsman — Fullstack Web Developer",
    template: "%s — Utsman",
  },
  description:
    "Peta project Utsman, fullstack web developer di Banjarbaru: sistem rumah sakit dan instansi publik di Kalimantan Selatan — pendaftaran OCR, bridging IDRG/INA-CBGs untuk klaim BPJS, HRIS, dan penerimaan siswa berbasis CBT.",
  keywords: [
    "Utsman",
    "Fullstack Web Developer",
    "Laravel",
    "Next.js",
    "Sistem rumah sakit",
    "Bridging BPJS",
    "INA-CBGs",
    "HRIS",
    "OCR KTP",
    "Banjarbaru",
    "Kalimantan Selatan",
  ],
  authors: [{ name: "Utsman" }],
  creator: "Utsman",
  openGraph: {
    title: "Utsman — Fullstack Web Developer",
    description:
      "Peta project: sistem rumah sakit dan instansi publik di Kalimantan Selatan. Pendaftaran OCR, bridging BPJS, HRIS, penerimaan siswa CBT.",
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
      "Peta project: sistem rumah sakit dan instansi publik di Kalimantan Selatan.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-body`}
      >
        <noscript>
          <style>{`[data-fade]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <JsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
