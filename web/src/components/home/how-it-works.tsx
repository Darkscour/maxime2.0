"use client";

/**
 * Typography preview mode is active on this section.
 *
 * The buttons at the top of the section swap the font used for the section
 * title, step numbers, and step titles. Body copy stays in Geist for a fair
 * comparison. Once you pick a winner, remove the toggle row and lock the
 * font in globally (or just on the headings, depending on scope).
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type FontOption = {
  key: "geist" | "saira" | "space" | "inter";
  label: string;
  varName: string;
};

const FONTS: readonly FontOption[] = [
  { key: "geist", label: "Geist (current)", varName: "--font-geist-sans" },
  { key: "saira", label: "Saira Condensed", varName: "--font-saira-condensed" },
  { key: "space", label: "Space Grotesk", varName: "--font-space-grotesk" },
  { key: "inter", label: "Inter Display", varName: "--font-inter-display" },
] as const;

const steps = [
  {
    number: "01",
    title: "Onboard your team in 60 seconds",
    description:
      "Pick your games, import your roster, link your Discord. Maxime builds a team profile that's the source of truth for every other feature.",
  },
  {
    number: "02",
    title: "Let the AI scout for you",
    description:
      "Set your recruitment criteria — role, rank floor, region, play style. Maxime ranks candidates across every connected database and shows why each is a fit.",
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
  const [font, setFont] = useState<FontOption>(FONTS[0]);
  const headingStyle = { fontFamily: `var(${font.varName})` } as const;

  return (
    <section
      id="how-it-works"
      className="relative border-y border-white/5 bg-[var(--background-elevated)]/30 py-24 sm:py-32"
    >
      <Container>
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            Preview font:
          </span>
          {FONTS.map((f) => {
            const active = f.key === font.key;
            return (
              <button
                key={f.key}
                onClick={() => setFont(f)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs transition-colors",
                  active
                    ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/40"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white",
                )}
                style={{ fontFamily: `var(${f.varName})` }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            How it works
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={headingStyle}
          >
            From signup to season‑ready in one afternoon
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
            No analyst, no GM, no problem. Maxime automates the work that used
            to require a five‑person back office.
          </p>
        </div>

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
                <span
                  className="text-3xl font-semibold tracking-tight text-gradient"
                  style={headingStyle}
                >
                  {step.number}
                </span>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold text-white"
                  style={headingStyle}
                >
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
