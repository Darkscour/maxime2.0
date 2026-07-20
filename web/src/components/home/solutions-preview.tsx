"use client";

import { useState } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Users } from "lucide-react";
import {
  SOLUTIONS,
  type SolutionAudience,
  type SolutionHighlight,
} from "@/lib/solutions-content";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const AUDIENCE_OPTIONS: {
  id: SolutionAudience;
  label: string;
  icon: typeof GraduationCap;
}[] = [
  { id: "collegiate", label: "Collegiate esports", icon: GraduationCap },
  { id: "grassroots", label: "Grassroots esports", icon: Users },
];

const revealContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function SolutionsPreview() {
  const searchParams = useSearchParams();
  const solutionParam = searchParams.get("solution");
  const queryAudience: SolutionAudience =
    solutionParam === "grassroots" ? "grassroots" : "collegiate";
  const [selectedAudience, setSelectedAudience] =
    useState<SolutionAudience>(queryAudience);
  const audience: SolutionAudience = selectedAudience;
  const content = SOLUTIONS[audience];

  useEffect(() => {
    setSelectedAudience(queryAudience);
  }, [queryAudience]);

  return (
    <section
      id="solutions"
      className="relative scroll-mt-24 border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--background-elevated)]/30 py-10 sm:py-12"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Solutions
          </p>
          <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Built for two kinds of esports orgs
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">
            Pick the track that matches your org. The cards below explain who
            each path is for and how membership works — not every product module.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
          {AUDIENCE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = audience === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedAudience(option.id)}
                aria-pressed={active}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[color-mix(in_srgb,var(--accent)_60%,white)]"
                    : "border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--surface)] text-[var(--foreground-muted)] hover:border-[var(--border)] hover:text-[var(--foreground)]",
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={audience}
            variants={revealContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-80px" }}
            className="mx-auto mt-8 max-w-5xl"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <AudienceCard
                eyebrow="Managers"
                heading={content.managerHeading}
                intro={content.managerIntro}
                highlights={content.managerHighlights}
                accent="violet"
              />
              <AudienceCard
                eyebrow="Players"
                heading={content.playerHeading}
                intro={content.playerIntro}
                highlights={content.playerHighlights}
                accent="cyan"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

function AudienceCard({
  eyebrow,
  heading,
  intro,
  highlights,
  accent,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  highlights: SolutionHighlight[];
  accent: "cyan" | "violet";
}) {
  const accentClass =
    accent === "cyan"
      ? "text-[color-mix(in_srgb,var(--accent)_85%,white)]"
      : "text-[color-mix(in_srgb,var(--accent-2)_85%,white)]";

  return (
    <motion.div
      variants={revealItem}
      className="rounded-2xl border border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--surface)] p-6 sm:p-8"
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          accentClass,
        )}
      >
        {eyebrow}
      </p>
      <h3 className="font-heading mt-2 text-xl font-semibold text-[var(--foreground)]">
        {heading}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">{intro}</p>
      <ul className="mt-5 space-y-3">
        {highlights.map((highlight) => (
          <HighlightRow key={highlight.text} highlight={highlight} />
        ))}
      </ul>
    </motion.div>
  );
}

function HighlightRow({ highlight }: { highlight: SolutionHighlight }) {
  const Icon = highlight.icon;
  const tone = highlight.tone ?? "cyan";
  const iconClass =
    tone === "cyan" ? "text-[var(--accent)]" : "text-[var(--accent-2)]";

  return (
    <li className="flex gap-3 text-sm leading-6">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] ring-1 ring-inset ring-[var(--border)]">
        <Icon className={cn("h-4 w-4", iconClass)} />
      </span>
      <span className="pt-1.5 text-[var(--foreground)]">{highlight.text}</span>
    </li>
  );
}
