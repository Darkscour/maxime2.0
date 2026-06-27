/**
 * Public sponsorship portal — demo sponsors only (marketing).
 * Signed-in users go to /dashboard/sponsorships for live data.
 */

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DemoSponsorshipDirectory } from "@/components/sponsorships/demo-sponsorship-directory";
import { MarketingFeaturePreviewShell } from "@/components/home/marketing-feature-preview-shell";
import { PreviewModeBanner } from "@/components/sponsorships/preview-banner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sponsorships — Maxime",
  description:
    "Preview how collegiate managers discover sponsors, filter by fit, and track outreach — using sample brand data on the marketing site.",
};

export default async function SponsorshipsPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard/sponsorships");
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5 bg-spotlight">
        <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
        <Container className="relative py-16 sm:py-20">
          <PreviewModeBanner />
          <div className="mt-6">
            <MarketingFeaturePreviewShell
              eyebrow="Partnerships"
              eyebrowAccent="emerald"
              title="Sponsor directory"
              description="Sample brands below — sign in as a collegiate manager for the live directory on your dashboard."
              previewNote="Preview — placeholder sponsor data"
            >
              <DemoSponsorshipDirectory />
            </MarketingFeaturePreviewShell>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/5 bg-[var(--surface)] p-8 text-center sm:p-12">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Unlock the live sponsor directory
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Sponsorship discovery is available to collegiate team managers after
              onboarding.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href="/sign-up" size="lg">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                href="/solutions/collegiate"
                className="text-sm text-zinc-400 hover:text-white"
              >
                Learn about collegiate solutions →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
