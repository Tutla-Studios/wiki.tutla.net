import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://wiki.tutla.net";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: { default: "Tutla Wiki", template: "%s | Tutla Wiki" },
  description:
    "The official Tutla Wiki — documentation for Tutla plugins, mods, apps, developer tools, and libraries. Open-source and community-driven.",
  keywords: [
    "tutla",
    "tutla wiki",
    "documentation",
    "docs",
    "minecraft plugins",
    "minecraft mods",
    "developer tools",
    "open source",
    "tusan",
    "tums",
  ],
  authors: [{ name: "Tutla", url: "https://tutla.net" }],
  creator: "Tutla",
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "Tutla Wiki",
    type: "website",
    url: BASE,
    locale: "en_US",
    title: "Tutla Wiki",
    description:
      "The official Tutla Wiki — documentation for Tutla plugins, mods, apps, developer tools, and libraries.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tutla",
    title: "Tutla Wiki",
    description:
      "The official Tutla Wiki — documentation for Tutla plugins, mods, apps, developer tools, and libraries.",
  },
  alternates: {
    canonical: BASE,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}