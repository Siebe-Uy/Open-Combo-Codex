import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://opencombocodex.com";
const siteDescription =
  "Open Combo Codex is an open-source Yu-Gi-Oh! TCG combo browser for searchable Sky Striker, Mitsurugi, and community-maintained combo documentation.";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Open Combo Codex",
  title: {
    default: "Open Combo Codex | Open-Source Yu-Gi-Oh! Combo Browser",
    template: "%s | Open Combo Codex",
  },
  description: siteDescription,
  keywords: [
    "Yu-Gi-Oh",
    "YGO combos",
    "Yu-Gi-Oh combo guide",
    "Sky Striker combos",
    "Mitsurugi combos",
    "TCG combo browser",
    "open source combo database",
    "YGOPRODeck",
  ],
  authors: [{ name: "Siebe", url: "https://ko-fi.com/siebeocc" }],
  creator: "Siebe",
  publisher: "Open Combo Codex",
  category: "gaming",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Open Combo Codex",
    description: siteDescription,
    url: "/",
    siteName: "Open Combo Codex",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Open Combo Codex logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Open Combo Codex",
    description: siteDescription,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${roboto.variable} ${roboto.className} min-h-screen antialiased`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
