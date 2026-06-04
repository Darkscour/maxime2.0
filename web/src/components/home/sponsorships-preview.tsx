import Link from "next/link";
import { ArrowRight, Filter, Handshake, ListChecks } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { SponsorFetchResult } from "@/lib/fetch-sponsors";
import { SponsorDemoPanel } from "./sponsor-demo-panel";
import { SponsorDbValidation } from "./sponsor-db-validation";

const bullets = [
  {
    icon: Filter,
    title: "Filter by fit",
    description:
      "Industry and sponsorship difficulty — find brands that match your org.",
  },
  {
    icon: Handshake,
    title: "Curated sponsor directory",
    description:
      "Verified sponsors from your database once your team is onboarded.",
  },
  {
    icon: ListChecks,
    title: "AI apply advice",
    description:
      "Ask whether a deal fits your team before you spend hours on an application.",
  },
];

export function SponsorshipsPreview({
  dbResult,
}: {
  dbResult: SponsorFetchResult;
}) {
  return (
    <section
      id="sponsorships"
      className="relative border-y border-white/5 bg-[var(--background-elevated)]/30 py-24 sm:py-32"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Sponsorships
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Land sponsors that actually fund collegiate teams
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              Browse sponsors, filter by fit, and get AI guidance on each
              application — built for real collegiate orgs, not solo players.
            </p>

            <ul className="mt-8 space-y-5">
              {bullets.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/sponsorships" size="lg">
                Open full portal
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                href="/sign-up"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Sign up for team access →
              </Link>
            </div>
          </div>

          <SponsorDemoPanel />
        </div>

        <SponsorDbValidation result={dbResult} />
      </Container>
    </section>
  );
}
