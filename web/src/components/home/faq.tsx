"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "./features";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Who is Maxime built for?",
    a: "Collegiate esports clubs, semi‑pro orgs, and grassroots teams below the top tier. If you have a roster and a Discord, you're our audience.",
  },
  {
    q: "Which games do you support?",
    a: "League of Legends, VALORANT, Counter‑Strike 2, Rocket League, Overwatch 2, Apex Legends, Dota 2, and Super Smash Bros. — with more added each month.",
  },
  {
    q: "Where does the player data come from?",
    a: "We aggregate from PandaScore, Riot Games API, OpenDota, FACEIT, and Tracker.gg, then enrich with verified player‑connected accounts. Curated collegiate data is built up as teams onboard.",
  },
  {
    q: "How do you find sponsors?",
    a: "A combination of manual curation, monitoring esports news for sponsorship announcements, and on‑demand enrichment via Clearbit and Hunter.io. Every sponsor in the portal has a verified application URL or contact.",
  },
  {
    q: "Is this free for student clubs?",
    a: "Yes. The free tier covers one team with a generous limit on players and sponsorship leads. Paid plans unlock the AI coach, unlimited rosters, and outreach automation.",
  },
  {
    q: "How is the AI fit score calculated?",
    a: "We weight player stats (rank, win rate, role consistency, recent form) against your team's stated criteria using a gradient‑boosted model. Every score comes with an explanation of which factors drove it.",
  },
];

export function FAQ() {
  return (
    <section className="border-y border-white/5 bg-[var(--background-elevated)]/30 py-24 sm:py-32">
      <Container>
        <SectionHeader
          eyebrow="FAQ"
          title="Everything you wanted to ask"
          subtitle="Still curious? Drop us a line in our Discord."
        />

        <div className="mx-auto mt-14 max-w-3xl divide-y divide-white/5 rounded-2xl border border-white/5 bg-[var(--surface)]">
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-6 py-5 sm:px-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-heading text-base font-medium text-white">{q}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-zinc-400 transition-transform",
            open && "rotate-180 text-cyan-400",
          )}
        />
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300",
          open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 text-sm leading-6 text-zinc-400">{a}</div>
      </div>
    </div>
  );
}
