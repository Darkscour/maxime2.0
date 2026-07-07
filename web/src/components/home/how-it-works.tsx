"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const steps = [
  {
    number: "01",
    title: "Choose collegiate or grassroots",
    description:
      "Pick your org type. Collegiate gets school verification and sponsor tools; grassroots gets regional scouting and roster management.",
  },
  {
    number: "02",
    title: "Build profiles that get discovered",
    description:
      "Managers set up their team. Players add game, rank, and role so recruitment happens through search — not random DMs.",
  },
  {
    number: "03",
    title: "Scout, invite, and match sponsors",
    description:
      "Browse players, save watchlists, send invites, and review join requests. Collegiate orgs can also track sponsor outreach.",
  },
  {
    number: "04",
    title: "Run the team from one dashboard",
    description:
      "Roster hub, invites, join requests, and sponsor pipeline in one place so managers and players stay aligned.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 border-b border-white/5 bg-[var(--background-elevated)]/30 py-10 sm:py-12"
    >
      <Container className="max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            How it works
          </p>
          <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            From signup to season‑ready in one afternoon
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
            No analyst, no GM, no problem. Maxime automates the work that used
            to require a five‑person back office.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="relative flex flex-col rounded-xl border border-white/5 bg-[var(--surface)] p-5"
            >
              <span className="font-heading text-xl font-semibold tracking-tight text-gradient">
                {step.number}
              </span>
              <h3 className="font-heading mt-3 text-sm font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
