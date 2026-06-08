import { ArrowRight, Filter, Handshake, ListChecks } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DemoSponsorshipDirectory } from "@/components/sponsorships/demo-sponsorship-directory";

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
      "Four sample sponsors in preview — sign in for the live directory on your dashboard.",
  },
  {
    icon: ListChecks,
    title: "AI apply advice",
    description:
      "Ask whether a deal fits your team before you spend hours on an application.",
  },
];

export function SponsorshipsPreview() {
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
              Preview four sample sponsors — the last card is blurred until you
              sign in for the live directory and pipeline tools on your dashboard.
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

            <div className="mt-10">
              <Button href="/sponsorships" size="lg">
                Open sponsorship portal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DemoSponsorshipDirectory compact />
        </div>
      </Container>
    </section>
  );
}
