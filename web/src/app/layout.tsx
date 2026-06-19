
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";
import "./globals.css";
import { MarketingOnly } from "@/components/app-chrome";
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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="relative min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-cyan-500/30"
        suppressHydrationWarning
      >
        <ClerkProvider
          appearance={clerkAuthAppearance}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInForceRedirectUrl="/auth/continue?intent=sign-in"
          signUpForceRedirectUrl="/auth/continue?intent=sign-up"
          signInFallbackRedirectUrl="/auth/continue?intent=sign-in"
          signUpFallbackRedirectUrl="/auth/continue?intent=sign-up"
        >
          <MarketingOnly>
            <Navbar />
          </MarketingOnly>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          <MarketingOnly>
            <Footer />
          </MarketingOnly>
        </ClerkProvider>
      </body>
    </html>
  );
}
