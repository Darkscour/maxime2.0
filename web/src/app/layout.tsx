import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Saira_Condensed,
  Space_Grotesk,
  Inter,
} from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

const sairaCondensed = Saira_Condensed({
  variable: "--font-saira-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const interDisplay = Inter({
  variable: "--font-inter-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Maxime — The AI Operating System for Esports Orgs",
  description:
    "Maxime is the all-in-one platform for collegiate and grassroots esports organizations. AI-powered recruitment, sponsorship discovery, and team management — in one place.",
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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#22d3ee",
          colorBackground: "#11141b",
          colorText: "#e6e8ee",
          colorInputBackground: "#0d0f14",
          colorInputText: "#e6e8ee",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${sairaCondensed.variable} ${spaceGrotesk.variable} ${interDisplay.variable} h-full antialiased`}
      >
        <body className="relative min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-cyan-500/30">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
