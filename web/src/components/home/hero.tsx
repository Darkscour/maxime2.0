"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Trophy, Users, Handshake } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-spotlight">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />

      <Container className="relative pt-24 pb-28 lg:pt-32 lg:pb-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Badge tone="cyan" className="px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI for the next generation of esports orgs
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-heading mx-auto mt-6 max-w-4xl text-center text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          The all‑in‑one OS for{" "}
          <span className="text-gradient">collegiate esports</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-400"
        >
          Recruit the right players, land the right sponsors, and run your
          team's back office — powered by AI built for amateur and lower‑tier
          organizations. No analysts, no spreadsheets, no Discord chaos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button href="/recruitment" size="lg">
            See how recruitment works
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/sponsorships" variant="outline" size="lg">
            Browse Sponsorships
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="gradient-border rounded-2xl bg-[var(--surface)]/80 p-2 shadow-2xl shadow-cyan-500/5 backdrop-blur">
            <div className="rounded-xl border border-white/5 bg-[var(--background)] p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-3">
                <StatCard
                  icon={<Users className="h-5 w-5" />}
                  value="12,400+"
                  label="Players in scouting pool"
                  tone="cyan"
                />
                <StatCard
                  icon={<Handshake className="h-5 w-5" />}
                  value="850+"
                  label="Sponsorship leads tracked"
                  tone="violet"
                />
                <StatCard
                  icon={<Trophy className="h-5 w-5" />}
                  value="300+"
                  label="Collegiate orgs onboarded"
                  tone="green"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: "cyan" | "violet" | "green";
}) {
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
