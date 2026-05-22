"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "./features";

const steps = [
  {
    number: "01",
    title: "Onboard your team in 60 seconds",
    description:
      "Pick your games, import your roster, link your Discord. Clutch builds a team profile that's the source of truth for every other feature.",
  },
  {
    number: "02",
    title: "Let the AI scout for you",
    description:
      "Set your recruitment criteria — role, rank floor, region, play style. Clutch ranks candidates across every connected database and shows why each is a fit.",
  },
  {
    number: "03",
    title: "Match with sponsors that match you",
    description:
      "We surface brands actively sponsoring orgs your size, generate a personalized pitch, and track every reply in one inbox. No more cold DMs.",
  },
  {
    number: "04",
    title: "Run the team, not the spreadsheets",
    description:
      "Scrim schedules, contracts, payouts, VOD reviews, AI coach — everything is wired into one dashboard your captain can actually manage.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-white/5 bg-[var(--background-elevated)]/30 py-24 sm:py-32"
    >
      <Container>
        <SectionHeader
          eyebrow="How it works"
          title="From signup to season‑ready in one afternoon"
          subtitle="No analyst, no GM, no problem. Clutch automates the work that used to require a five‑person back office."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative flex gap-6 rounded-2xl border border-white/5 bg-[var(--surface)] p-8"
            >
              <div className="shrink-0">
                <span className="text-3xl font-semibold tracking-tight text-gradient">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
