"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { IllustrationFrame } from "./feature-art/shared";

type FeatureCard = {
  id: string;
  illustration: React.ReactNode;
  title: string;
  description: string;
  access: string;
  roadmap?: boolean;
};

const MANAGER_FEATURES: FeatureCard[] = [
  {
    id: "recruit",
    illustration: <RecruitmentArt />,
    title: "Recruitment Portal",
    description: "Search verified players, build a watchlist, and send invites.",
    access: "Team managers",
  },
  {
    id: "sponsors",
    illustration: <SponsorshipsArt />,
    title: "Sponsorship Directory",
    description: "Browse curated brands and track outreach in a pipeline.",
    access: "Collegiate managers",
  },
  {
    id: "ai-coach",
    illustration: <AiCoachArt />,
    title: "AI assistant",
    description: "Draft tryouts, sponsor pitches, and team comms instantly.",
    access: "Team managers",
  },
  {
    id: "roster",
    illustration: <RosterArt />,
    title: "Roster hub",
    description: "Manage active members, roles, and your public team page.",
    access: "Team managers",
  },
];

const PLAYER_FEATURES: FeatureCard[] = [
  {
    id: "discover",
    illustration: <PlayerProfileArt />,
    title: "Player profile",
    description: "A scout card with your game, role, rank, and availability.",
    access: "Players",
  },
  {
    id: "browse-teams",
    illustration: <TeamDiscoveryArt />,
    title: "Browse teams",
    description: "Explore orgs that are recruiting and request to join.",
    access: "Players",
  },
  {
    id: "invites",
    illustration: <InviteFlowArt />,
    title: "Team invites",
    description: "Review and respond to roster offers from one inbox.",
    access: "Players",
  },
  {
    id: "duels",
    illustration: <DuelsArt />,
    title: "Duels",
    description:
      "Teams challenge rival orgs and players join community matchups — grassroots competition for both sides.",
    access: "Players & teams",
  },
];

const ROADMAP_FEATURES: FeatureCard[] = [
  {
    id: "ai-vod",
    illustration: <VodReviewArt />,
    title: "AI VOD review",
    description:
      "Upload your gameplay and an AI bot reviews it, then gives tailored advice on what to improve.",
    access: "Coming to all accounts",
    roadmap: true,
  },
  {
    id: "discord",
    illustration: <DiscordArt />,
    title: "Discord-native",
    description: "Run team workflows where your org already communicates.",
    access: "Team managers",
    roadmap: true,
  },
  {
    id: "scrim",
    illustration: <ScrimFinderArt />,
    title: "Scrim finder",
    description: "Match teams at your level and schedule practice blocks.",
    access: "Team managers",
    roadmap: true,
  },
];

const revealContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function PlatformFeatures() {
  return (
    <section
      id="features"
      className="scroll-mt-24 border-b border-white/5 bg-[var(--background-elevated)]/20 py-10 sm:py-12"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Features
          </p>
          <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Everything on the platform
          </h2>
          <p className="mt-3 text-base leading-7 text-zinc-400">
            A full look at the product surfaces Maxime offers. What you unlock
            after signup depends on your account type — collegiate or grassroots,
            manager or player — not every module appears on every dashboard.
          </p>
        </div>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-8 space-y-8"
        >
          <FeatureRow
            label="For team managers"
            features={MANAGER_FEATURES}
            cols="lg:grid-cols-4"
          />
          <FeatureRow
            label="For players"
            features={PLAYER_FEATURES}
            cols="lg:grid-cols-4"
          />

          <div className="pt-2">
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  On the roadmap
                </p>
                <Badge tone="amber" className="text-[10px]">
                  <Clock className="h-3 w-3" />
                  Coming soon
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                These features are still in active development and aren&apos;t
                available yet — here&apos;s what&apos;s coming next.
              </p>
            </div>
            <div className="mx-auto mt-5 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ROADMAP_FEATURES.map((card) => (
                <motion.div
                  key={card.id}
                  variants={revealItem}
                  className="group flex flex-col rounded-xl border border-dashed border-white/10 bg-[var(--surface)]/70 p-2.5 opacity-80 shadow-lg shadow-black/10 transition-all hover:border-amber-400/30 hover:opacity-100"
                >
                  {card.illustration}
                  <div className="px-2.5 pt-3 pb-2">
                    <h3 className="font-heading text-sm font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function FeatureRow({
  label,
  features,
  cols,
}: {
  label: string;
  features: FeatureCard[];
  cols: string;
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>
      <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 ${cols}`}>
        {features.map((card) => (
          <FeatureModuleCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

function FeatureModuleCard({ card }: { card: FeatureCard }) {
  return (
    <motion.div
      variants={revealItem}
      className="group flex flex-col rounded-xl border border-white/10 bg-[var(--surface)] p-2.5 shadow-lg shadow-black/10 transition-colors hover:border-cyan-400/30 hover:bg-[var(--surface-2)]"
    >
      {card.illustration}
      <div className="px-1.5 pt-3 pb-1.5">
        <h3 className="font-heading text-sm font-semibold text-white">
          {card.title}
        </h3>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Player profile illustration: a scout card with avatar, name lines, a rank
 * chip, and three stat bars (one highlighted). Thin technical strokes to match
 * the manager-side illustration family.
 */
function PlayerProfileArt() {
  const bars = [
    { y: 84, fill: 150, accent: false },
    { y: 98, fill: 132, accent: false },
    { y: 112, fill: 190, accent: true },
  ];
  return (
    <IllustrationFrame accent="violet" className="aspect-[16/10]">
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="20"
          y="20"
          width="200"
          height="104"
          rx="8"
          className="stroke-zinc-700"
          strokeWidth="1.25"
        />
        <circle
          cx="48"
          cy="50"
          r="14"
          className="stroke-violet-400 fill-violet-400/10"
          strokeWidth="1.25"
        />
        <path
          d="M38 64c4-7 16-7 20 0"
          className="stroke-violet-400"
          strokeWidth="1.25"
        />
        <line x1="74" y1="44" x2="150" y2="44" className="stroke-zinc-500" strokeWidth="1.25" />
        <line x1="74" y1="54" x2="124" y2="54" className="stroke-zinc-700" strokeWidth="1.25" />
        <rect
          x="176"
          y="30"
          width="34"
          height="16"
          rx="4"
          className="stroke-violet-400/70 fill-violet-400/10"
          strokeWidth="1.25"
        />
        {bars.map((b, i) => (
          <g key={i}>
            <line x1="32" y1={b.y} x2="64" y2={b.y} className="stroke-zinc-600" strokeWidth="1.25" />
            <line x1="76" y1={b.y} x2="208" y2={b.y} className="stroke-zinc-800" strokeWidth="3" />
            <line
              x1="76"
              y1={b.y}
              x2={b.fill}
              y2={b.y}
              className={b.accent ? "stroke-violet-400" : "stroke-zinc-500"}
              strokeWidth="3"
            />
          </g>
        ))}
      </svg>
    </IllustrationFrame>
  );
}

/**
 * Browse teams illustration: a search bar above three "team crest" tiles, with
 * the middle tile highlighted as the active result.
 */
function TeamDiscoveryArt() {
  const tiles = [
    { x: 24, active: false },
    { x: 92, active: true },
    { x: 160, active: false },
  ];
  const tileW = 56;
  const hex = (cx: number, cy: number, r: number) =>
    `${cx},${cy - r} ${cx + r * 0.87},${cy - r / 2} ${cx + r * 0.87},${cy + r / 2} ${cx},${cy + r} ${cx - r * 0.87},${cy + r / 2} ${cx - r * 0.87},${cy - r / 2}`;

  return (
    <IllustrationFrame accent="cyan" className="aspect-[16/10]">
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="24" y="22" width="192" height="18" rx="9" className="stroke-zinc-700" strokeWidth="1.25" />
        <circle cx="40" cy="31" r="4.5" className="stroke-zinc-500" strokeWidth="1.25" />
        <line x1="43.5" y1="34.5" x2="48" y2="39" className="stroke-zinc-500" strokeWidth="1.25" />
        <line x1="58" y1="31" x2="150" y2="31" className="stroke-zinc-700" strokeWidth="1.25" />

        {tiles.map((t, i) => {
          const cx = t.x + tileW / 2;
          return (
            <g key={i}>
              <rect
                x={t.x}
                y="56"
                width={tileW}
                height="60"
                rx="8"
                className={t.active ? "stroke-cyan-400 fill-cyan-400/[0.06]" : "stroke-zinc-700"}
                strokeWidth="1.25"
              />
              <polygon
                points={hex(cx, 78, 11)}
                className={t.active ? "stroke-cyan-300 fill-cyan-400/10" : "stroke-zinc-600"}
                strokeWidth="1.25"
              />
              <line
                x1={cx - 14}
                y1="100"
                x2={cx + 14}
                y2="100"
                className={t.active ? "stroke-cyan-300" : "stroke-zinc-600"}
                strokeWidth="1.25"
              />
              <line
                x1={cx - 9}
                y1="108"
                x2={cx + 9}
                y2="108"
                className={t.active ? "stroke-cyan-300/60" : "stroke-zinc-700"}
                strokeWidth="1.25"
              />
            </g>
          );
        })}
      </svg>
    </IllustrationFrame>
  );
}

/**
 * Team invites illustration: a stacked inbox of envelope rows, with the middle
 * row highlighted and marked accepted via a check.
 */
function InviteFlowArt() {
  const rows = [
    { y: 26, active: false },
    { y: 58, active: true },
    { y: 90, active: false },
  ];
  return (
    <IllustrationFrame accent="violet" className="aspect-[16/10]">
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {rows.map((r, i) => (
          <g key={i}>
            <rect
              x="28"
              y={r.y}
              width="184"
              height="24"
              rx="5"
              className={r.active ? "stroke-violet-400 fill-violet-400/[0.06]" : "stroke-zinc-700"}
              strokeWidth="1.25"
            />
            <rect
              x="38"
              y={r.y + 6}
              width="22"
              height="12"
              rx="2"
              className={r.active ? "stroke-violet-300" : "stroke-zinc-600"}
              strokeWidth="1.25"
            />
            <path
              d={`M38 ${r.y + 6}l11 7 11-7`}
              className={r.active ? "stroke-violet-300" : "stroke-zinc-600"}
              strokeWidth="1.25"
            />
            <line
              x1="72"
              y1={r.y + 9}
              x2="150"
              y2={r.y + 9}
              className={r.active ? "stroke-violet-200" : "stroke-zinc-600"}
              strokeWidth="1.25"
            />
            <line
              x1="72"
              y1={r.y + 16}
              x2="124"
              y2={r.y + 16}
              className={r.active ? "stroke-violet-300/50" : "stroke-zinc-700"}
              strokeWidth="1.25"
            />
            {r.active ? (
              <g>
                <circle cx="194" cy={r.y + 12} r="8" className="stroke-cyan-400 fill-cyan-400/10" strokeWidth="1.25" />
                <path d={`M190 ${r.y + 12}l3 3 5-6`} className="stroke-cyan-300" strokeWidth="1.5" />
              </g>
            ) : (
              <circle cx="194" cy={r.y + 12} r="2.5" className="fill-zinc-600" stroke="none" />
            )}
          </g>
        ))}
      </svg>
    </IllustrationFrame>
  );
}

/**
 * Duels illustration: two crossed swords (each with blade, fuller, crossguard,
 * grip, and pommel) over a faint circular arena, suggesting a 1v1 challenge.
 */
function DuelsArt() {
  return (
    <IllustrationFrame accent="violet" className="aspect-[16/10]">
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="120" cy="70" r="42" className="stroke-white/10" strokeWidth="1.25" />

        {/* Sword A — bottom-left to top-right (violet) */}
        <g>
          <polygon
            points="60,98 152,28 65,103"
            className="fill-violet-400/10 stroke-violet-400"
            strokeWidth="1.25"
          />
          <line x1="63" y1="100" x2="150" y2="30" className="stroke-violet-300/60" strokeWidth="1" />
          <line x1="54.5" y1="90.5" x2="69.5" y2="109.5" className="stroke-violet-300" strokeWidth="1.5" />
          <line x1="62" y1="100" x2="49.5" y2="110" className="stroke-zinc-400" strokeWidth="1.5" />
          <circle cx="47" cy="112" r="3.5" className="stroke-zinc-400 fill-zinc-700" strokeWidth="1.25" />
        </g>

        {/* Sword B — bottom-right to top-left (cyan) */}
        <g>
          <polygon
            points="180,98 88,28 175,103"
            className="fill-cyan-400/10 stroke-cyan-400"
            strokeWidth="1.25"
          />
          <line x1="177" y1="100" x2="90" y2="30" className="stroke-cyan-300/60" strokeWidth="1" />
          <line x1="185.5" y1="90.5" x2="170.5" y2="109.5" className="stroke-cyan-300" strokeWidth="1.5" />
          <line x1="178" y1="100" x2="190.5" y2="110" className="stroke-zinc-400" strokeWidth="1.5" />
          <circle cx="193" cy="112" r="3.5" className="stroke-zinc-400 fill-zinc-700" strokeWidth="1.25" />
        </g>
      </svg>
    </IllustrationFrame>
  );
}

/** @deprecated Use PlatformFeatures */
export const SolutionFeaturesPanel = PlatformFeatures;
