import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clutch — The AI Operating System for Esports Orgs",
  description:
    "Clutch is the all-in-one platform for collegiate and grassroots esports organizations. AI-powered recruitment, sponsorship discovery, and team management — in one place.",
  keywords: [
    "esports",
    "collegiate esports",
    "esports recruitment",
    "esports sponsorships",
    "AI esports",
    "team management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-cyan-500/30">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
