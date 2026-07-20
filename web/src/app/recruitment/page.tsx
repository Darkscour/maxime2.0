/**
 * Recruitment overview page — public preview with dashboard-style layout.
 */

import Link from "next/link";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoRecruitmentDirectory } from "@/components/recruitment/demo-recruitment-directory";
import { MarketingFeaturePreviewShell } from "@/components/home/marketing-feature-preview-shell";

export const metadata = {
  title: "Recruitment — Maxime",
  description:
    "Preview how Maxime helps managers scout players and helps players get discovered — with filters, fit scores, and roster invites.",
};

export default function RecruitmentPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-spotlight">
        <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
        <Container className="relative py-16 sm:py-20">
          <Badge tone="cyan">
            <Target className="h-3.5 w-3.5" /> Recruitment Portal
          </Badge>
          <h1 className="font-heading mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Scout players that actually{" "}
            <span className="text-gradient">fit your roster</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--foreground-muted)]">
            Preview sample profiles below — sign in for the full scout directory
            and outreach tools.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="amber">
              <Sparkles className="h-3.5 w-3.5" /> Preview — sample player data
            </Badge>
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <MarketingFeaturePreviewShell
            eyebrow="Recruitment"
            eyebrowAccent="violet"
            title="Player profiles"
            description="Same scout experience managers see in their dashboard."
            previewNote="Sample players — last card blurred until sign-in"
          >
            <DemoRecruitmentDirectory />
          </MarketingFeaturePreviewShell>
        </Container>
      </section>

      <section className="border-t border-[var(--border)] py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center sm:p-12">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Ready to scout your roster?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
              Sign up as a team manager or player to unlock the live directory,
              watchlist, and invite tools.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href="/sign-up" size="lg">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                href="/#solutions"
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                See collegiate vs grassroots →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
