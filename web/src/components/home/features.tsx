"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import {
  RecruitmentArt,
  SponsorshipsArt,
  AiCoachArt,
  RosterArt,
  ScrimFinderArt,
  VodReviewArt,
  DiscordArt,
} from "./feature-art";

type FeatureCard = {
  illustration: React.ReactNode;
  title: string;
  description: string;
};

const pillars: FeatureCard[] = [
  {
    illustration: <RecruitmentArt />,
    title: "Scout the right players",
    description:
      "Filter verified collegiate talent and let the fit-score model rank them against your roster.",
  },
  {
    illustration: <SponsorshipsArt />,
    title: "Land the right sponsors",
    description:
      "A curated network of brands actively backing grassroots and collegiate esports.",
  },
  {
    illustration: <AiCoachArt />,
    title: "An AI built for your team",
    description:
      "Drafts, tryouts, sponsor pitches — answered in seconds, in the language of your game.",
  },
];

const secondary: FeatureCard[] = [
  {
    illustration: <RosterArt />,
    title: "Roster Hub",
    description: "One source of truth for every player.",
  },
  {
    illustration: <ScrimFinderArt />,
    title: "Scrim Finder",
    description: "Match teams at your level, on your schedule.",
  },
  {
    illustration: <VodReviewArt />,
    title: "AI VOD Review",
    description: "Key moments, timestamped automatically.",
  },
  {
    illustration: <DiscordArt />,
    title: "Discord-native",
    description: "Lives where your team already is.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeader
          eyebrow="The platform"
          title="Three things, done seriously."
          subtitle="Built for the captain running a roster, a budget, and a Discord — alone."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative flex flex-col rounded-xl border border-white/5 bg-[var(--surface)] p-3 transition-colors hover:border-cyan-400/30 hover:bg-[var(--surface-2)]"
            >
              {p.illustration}
              <div className="px-3 pt-5 pb-3">
                <h3 className="text-base font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {secondary.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: 0.18 + i * 0.05 }}
              className="group relative flex flex-col rounded-xl border border-white/5 bg-[var(--surface)] p-2.5 transition-colors hover:border-violet-400/30 hover:bg-[var(--surface-2)]"
            >
              {s.illustration}
              <div className="px-2.5 pt-4 pb-2">
                <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
