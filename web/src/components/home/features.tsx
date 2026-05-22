"use client";

import { motion } from "framer-motion";
import {
  Target,
  Handshake,
  Bot,
  Users2,
  CalendarRange,
  Video,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "live" | "soon" | "planned";
  accent: "cyan" | "violet";
};

const features: Feature[] = [
  {
    icon: <Target className="h-5 w-5" />,
    title: "AI Recruitment Portal",
    description:
      "Filter 12k+ players across every collegiate title. Our fit‑score model ranks candidates against your roster needs, region, and play style in seconds.",
    status: "live",
    accent: "cyan",
  },
  {
    icon: <Handshake className="h-5 w-5" />,
    title: "Sponsorship Discovery",
    description:
      "A curated database of brands actively sponsoring grassroots and collegiate orgs — with check‑size ranges, application links, and AI‑generated outreach drafts.",
    status: "live",
    accent: "violet",
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: "AI Coach",
    description:
      "Ask anything from draft strategy to running tryouts. Trained on game‑specific knowledge and your team's history. Always on the sideline.",
    status: "soon",
    accent: "cyan",
  },
  {
    icon: <Users2 className="h-5 w-5" />,
    title: "Roster Hub",
    description:
      "Replace the spreadsheets. Track players, roles, availability, and contracts with one source of truth — synced to Discord and start.gg.",
    status: "soon",
    accent: "violet",
  },
  {
    icon: <CalendarRange className="h-5 w-5" />,
    title: "Scrim Finder",
    description:
      "Match against teams of similar rank and schedule. Auto‑negotiate maps and modes. No more cold DMs into the void.",
    status: "planned",
    accent: "cyan",
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: "AI VOD Review",
    description:
      "Upload a match replay, get a timestamped breakdown of every key moment — objectives, rotations, fight outcomes. Coaching at 10x speed.",
    status: "planned",
    accent: "violet",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Discord Integration",
    description:
      "Native bot pushes recruit applications, sponsor intros, and scrim invites into your team's channels. Stay where your players already are.",
    status: "soon",
    accent: "cyan",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Contracts & Treasury",
    description:
      "Lawyer‑reviewed templates for rosters, sponsors, and revenue splits. Track sponsorship payouts and prize money in one place.",
    status: "planned",
    accent: "violet",
  },
];

const statusBadge = {
  live: <Badge tone="green">Live</Badge>,
  soon: <Badge tone="amber">Coming soon</Badge>,
  planned: <Badge tone="zinc">Planned</Badge>,
};

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeader
          eyebrow="Everything in one platform"
          title="Built for the orgs the rest of the market ignores"
          subtitle="Pro teams have analysts, agents, and back‑office staff. Amateur orgs have one overworked captain. Clutch closes that gap with AI‑assisted tools for every stage of running a team."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group relative flex flex-col rounded-xl border border-white/5 bg-[var(--surface)] p-6 transition-colors hover:border-cyan-400/30 hover:bg-[var(--surface-2)]"
            >
              <div className="flex items-center justify-between">
                <div
                  className={
                    f.accent === "cyan"
                      ? "flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/30"
                      : "flex h-10 w-10 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/30"
                  }
                >
                  {f.icon}
                </div>
                {statusBadge[f.status]}
              </div>
              <h3 className="mt-5 text-base font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {f.description}
              </p>
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
