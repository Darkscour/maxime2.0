"use client";

import { GraduationCap, Trophy, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/home/section-header";

type StatTone = "cyan" | "violet" | "green";

type ImpactStat = {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: StatTone;
};

const IMPACT_STATS: ImpactStat[] = [
  {
    icon: <GraduationCap className="h-5 w-5" />,
    value: "3,000+",
    label: "US colleges with esports programs",
    tone: "cyan",
  },
  {
    icon: <Users className="h-5 w-5" />,
    value: "532M+",
    label: "Global esports fans & players",
    tone: "violet",
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    value: "90%+",
    label: "Competitive players are amateur or grassroots",
    tone: "green",
  },
];

export function ImpactBand() {
  return (
    <section
      id="impact"
      className="scroll-mt-24 border-b border-white/5 py-10 sm:py-12"
    >
      <Container>
        <SectionHeader
          eyebrow="The opportunity"
          title="Esports is growing — amateur orgs need better tools"
          subtitle="Maxime is built for the programs that don't have enterprise budgets but still compete at the highest level."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {IMPACT_STATS.map((stat) => (
            <ImpactStatCard key={stat.label} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ImpactStatCard({ icon, value, label, tone }: ImpactStat) {
  const ring =
    tone === "cyan"
      ? "ring-cyan-400/30 text-cyan-300"
      : tone === "violet"
        ? "ring-violet-400/30 text-violet-300"
        : "ring-emerald-400/30 text-emerald-300";

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6 text-center shadow-lg shadow-black/10">
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] ring-1 ring-inset ${ring}`}
      >
        {icon}
      </div>
      <div className="font-heading mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {value}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{label}</p>
    </div>
  );
}
