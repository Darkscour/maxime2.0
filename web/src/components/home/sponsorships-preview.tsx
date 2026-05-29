import Link from "next/link";
import { ArrowRight, Filter, Handshake, ListChecks } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SponsorshipsArt } from "./feature-art";

const bullets = [
  {
    icon: Filter,
    title: "Filter by fit",
    description:
      "Industry, region, game title, and deal size — so you only pitch brands that match your org.",
  },
  {
    icon: Handshake,
    title: "Curated sponsor directory",
    description:
      "Sample opportunities show how teams discover brands open to collegiate and grassroots esports.",
  },
  {
    icon: ListChecks,
    title: "Track outreach after sign-in",
    description:
      "Apply, save leads, and follow up from one pipeline once you create an account.",
  },
];

export function SponsorshipsPreview() {
  return (
    <section
      id="sponsorships"
      className="relative border-y border-white/5 bg-[var(--background-elevated)]/30 py-24 sm:py-32"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Sponsorships
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Land sponsors that actually fund collegiate teams
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              Browse a curated directory, filter by fit, and track outreach —
              without a spreadsheet pinned in Discord.
            </p>

            <ul className="mt-8 space-y-5">
              {bullets.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/30">
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
                Explore the demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                href="/sign-up"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Sign in to apply and save leads →
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-white/5 bg-[var(--surface)] p-3 shadow-2xl shadow-violet-500/5">
              <SponsorshipsArt />
            </div>
            <p className="mt-3 text-center text-xs text-zinc-500">
              Interactive demo uses sample sponsors for preview only.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
