
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";
import { authContinueSignupPath } from "@/lib/auth-intent";
import "./globals.css";
import { AuthOnly, MarketingFooterOnly, MarketingOnly } from "@/components/app-chrome";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BenignNavigationErrors } from "@/components/providers/benign-navigation-errors";

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
  icons: {
    icon: [
      { url: "/maxime-mark.png", sizes: "32x32", type: "image/png" },
      { url: "/maxime-mark.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
        className="relative min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
        suppressHydrationWarning
      >
        <ClerkProvider
          appearance={clerkAuthAppearance}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInForceRedirectUrl="/auth/continue?intent=sign-in"
          signUpForceRedirectUrl={authContinueSignupPath()}
          signInFallbackRedirectUrl="/auth/continue?intent=sign-in"
          signUpFallbackRedirectUrl={authContinueSignupPath()}
        >
          <BenignNavigationErrors />
          <MarketingOnly>
            <Navbar />
          </MarketingOnly>
          <AuthOnly>
            <AuthPageHeader />
          </AuthOnly>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          <MarketingFooterOnly>
            <Footer />
          </MarketingFooterOnly>
        </ClerkProvider>
      </body>
    </html>
  );
}
