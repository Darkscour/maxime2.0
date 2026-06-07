/**
 * Recruitment overview page.
 *
 * Public-facing preview with sample player profiles and filters.
 * Full live scout database opens for signed-in teams when built.
 */

import Link from "next/link";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecruitmentDemoPanel } from "@/components/recruitment/recruitment-demo-panel";

export const metadata = {
  title: "Recruitment — Maxime",
  description:
    "An AI-powered recruitment portal built for collegiate and lower-tier esports orgs. Filter verified players, rank candidates with a fit score, and reach out from one dashboard.",
};

export default function RecruitmentPage() {
  return (
    <>
      <PageHeader />
      <section className="pb-16 sm:pb-20">
        <Container>
          <RecruitmentDemoPanel previewLimit={4} showFilters={false} />
        </Container>
      </section>
      <EarlyAccess />
    </>
  );
}

function PageHeader() {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-spotlight">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <Badge tone="cyan">
          <Target className="h-3.5 w-3.5" /> Recruitment Portal
        </Badge>
        <h1 className="font-heading mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Scout players that actually{" "}
          <span className="text-gradient">fit your roster</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          Preview four sample profiles — the last card is blurred until you
          sign in for the full scout database and outreach tools.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="amber">
            <Sparkles className="h-3.5 w-3.5" /> Preview — sample player data
          </Badge>
        </div>
      </Container>
    </section>
  );
}

function EarlyAccess() {
  return (
    <section className="border-t border-white/5 py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/5 bg-[var(--surface)] p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Get access when recruitment goes live
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            We&apos;re onboarding a small group of collegiate orgs first. Sign
            up to be notified the moment the full portal opens — verified
            player profiles, fit scoring, and one-click outreach.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href="/sign-up" size="lg">
              Request early access
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Link
              href="/#features"
              className="text-sm text-zinc-400 hover:text-white"
            >
              See the rest of the platform →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
