"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Trophy,
  Users,
  Handshake,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type StatTone = "cyan" | "violet" | "green";

type HeroStat = {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: StatTone;
};

/** Restore these when real Maxime platform metrics are available. */
const PLATFORM_STATS: HeroStat[] = [
  {
    icon: <Users className="h-5 w-5" />,
    value: "12,400+",
    label: "Players in scouting pool",
    tone: "cyan",
  },
  {
    icon: <Handshake className="h-5 w-5" />,
    value: "850+",
    label: "Sponsorship leads tracked",
    tone: "violet",
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    value: "300+",
    label: "Orgs onboarded",
    tone: "green",
  },
];

/** Industry context shown until platform metrics are ready. */
const INDUSTRY_STATS: HeroStat[] = [
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

const HERO_STATS = INDUSTRY_STATS;
// Swap to PLATFORM_STATS when live Maxime numbers are available.

export function Hero() {
  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden bg-spotlight">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />

      <Container className="relative pt-20 pb-14 lg:pt-28 lg:pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            The all‑in‑one OS for{" "}
            <span className="text-gradient">collegiate & grassroots esports</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-5 max-w-2xl text-center text-lg leading-7 text-zinc-400"
          >
            Managers scout players, land sponsors, and run rosters. Players get
            discovered and join teams — one workspace for amateur orgs, without
            spreadsheets or Discord chaos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="/sign-up" size="lg">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/#solutions" variant="outline" size="lg">
              Explore solutions
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-12 max-w-5xl"
        >
          <div className="gradient-border rounded-2xl bg-[var(--surface)]/80 p-2 shadow-2xl shadow-cyan-500/5 backdrop-blur">
            <div className="rounded-xl border border-white/5 bg-[var(--background)] p-5 sm:p-6">
              <div className="grid gap-5 sm:grid-cols-3">
                {HERO_STATS.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function StatCard({ icon, value, label, tone }: HeroStat) {
  const ring =
    tone === "cyan"
      ? "ring-cyan-400/30 text-cyan-300"
      : tone === "violet"
        ? "ring-violet-400/30 text-violet-300"
        : "ring-emerald-400/30 text-emerald-300";
  return (
    <div className="flex items-start gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] ring-1 ring-inset ${ring}`}
      >
        {icon}
      </div>
      <div>
        <div className="font-heading text-2xl font-semibold tracking-tight text-white">
          {value}
        </div>
        <div className="text-sm text-zinc-400">{label}</div>
      </div>
    </div>
  );
}
