"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ClipboardList,
  Clock,
  GraduationCap,
  Search,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  AiCoachArt,
  DiscordArt,
  RecruitmentArt,
  RosterArt,
  ScrimFinderArt,
  SponsorshipsArt,
  VodReviewArt,
} from "@/components/home/feature-art";
import {
  DuelsArt,
  InviteFlowArt,
  PlayerProfileArt,
  TeamDiscoveryArt,
} from "@/components/home/solution-features-panel";
import { marketingAvatarUrl } from "@/lib/marketing-dashboard-mock";
import { cn } from "@/lib/utils";

const OvercastHashContext = createContext("/");

/** Instant jump to section — no scroll animation (nav clicks). */
function jumpToSection(hash: string, hashRoot: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "auto", block: "start" });
  const path = hashRoot === "/" ? `/#${id}` : `${hashRoot}#${id}`;
  window.history.replaceState(null, "", path);
  return true;
}

function HashLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const hashRoot = useContext(OvercastHashContext);
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith("#")) return;
    if (jumpToSection(href, hashRoot)) e.preventDefault();
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

const revealItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const revealStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={revealItem}
    >
      {children}
    </motion.div>
  );
}

function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={revealStagger}
    >
      {children}
    </motion.div>
  );
}

function RevealChild({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={revealItem}>
      {children}
    </motion.div>
  );
}

const GAMES = [
  "League of Legends",
  "VALORANT",
  "Counter-Strike 2",
  "Rocket League",
  "Overwatch 2",
  "Apex Legends",
];

const STEPS: {
  n: string;
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    n: "01",
    title: "Pick collegiate or grassroots",
    body: "Campus programs get school-scoped scouting and sponsor tools. Community teams get regional discovery and roster ops.",
    icon: GraduationCap,
  },
  {
    n: "02",
    title: "Put real profiles on the board",
    body: "Managers set the org. Players add game, rank, and role so recruitment is search — not buried Discord DMs.",
    icon: UserRound,
  },
  {
    n: "03",
    title: "Scout, invite, chase sponsors",
    body: "Watchlist prospects, send invites, review join requests. Collegiate orgs keep sponsor outreach in the same place.",
    icon: Search,
  },
  {
    n: "04",
    title: "Run the week from one desk",
    body: "Roster hub, invites, and pipeline status live together so captains stop juggling five group chats.",
    icon: ClipboardList,
  },
];

const TRACKS = [
  {
    id: "collegiate",
    label: "Collegiate",
    icon: GraduationCap,
    title: "Campus-bound membership. Verified players only.",
    points: [
      "Scout students at your school",
      "Sponsor directory + outreach tracker",
      "Roster roles and public team page",
      "Join requests in one inbox",
    ],
  },
  {
    id: "grassroots",
    label: "Grassroots",
    icon: Users,
    title: "Regional teams that outgrew the pinned spreadsheet.",
    points: [
      "Open scouting by game and rank",
      "Watchlist and invite flow",
      "Duels for community matchups",
      "Roster ops without Discord archaeology",
    ],
  },
] as const;

type FeatureCard = {
  id: string;
  illustration: ReactNode;
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
      "Upload gameplay and get an LLM-powered VOD breakdown with tailored notes to improve.",
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

const FEATURE_NAV = [
  { href: "#features-managers", label: "Managers" },
  { href: "#features-players", label: "Players" },
  { href: "#features-roadmap", label: "Roadmap" },
] as const;

const FRAME_NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#solutions", label: "Solutions" },
  { href: "#features", label: "Features" },
  { href: "#compare", label: "Why Maxime" },
  { href: "#faq", label: "FAQ" },
] as const;

type Cell = "yes" | "partial" | "no";

const COMPARE: { label: string; maxime: Cell; others: Cell }[] = [
  { label: "Player scouting + fit signal", maxime: "yes", others: "no" },
  { label: "Watchlist → invite pipeline", maxime: "yes", others: "partial" },
  { label: "Sponsorship discovery", maxime: "yes", others: "no" },
  { label: "Roster + team page", maxime: "yes", others: "partial" },
  { label: "Built for amateur orgs", maxime: "yes", others: "partial" },
];

const FAQS = [
  {
    q: "Who is Maxime for?",
    a: "Amateur and collegiate managers who recruit and run teams, and players who want captains to find them — without turning Discord into a database.",
  },
  {
    q: "Collegiate vs grassroots?",
    a: "Collegiate ties to a verified school with campus-only scouting and sponsor tools. Grassroots is region-based with open discovery and Duels.",
  },
  {
    q: "How does recruitment work?",
    a: "Managers search profiles, shortlist on a watchlist, and send invites. Players browse teams and manage offers from one inbox.",
  },
  {
    q: "Is it free to start?",
    a: "Yes. You can create an org and run core recruitment on the free tier — no card required to look around.",
  },
];

/** Scout-style player profiles — fields captains see on /dashboard/scout. */
const PROFILE_CARDS = [
  {
    handle: "RogueNova",
    game: "VALORANT",
    role: "Duelist",
    rank: "Immortal",
    region: "NA East",
    school: "UC Berkeley",
    hours: 28,
    status: "Open",
    fit: 94,
    imageUrl: marketingAvatarUrl("scout-rogue-nova"),
  },
  {
    handle: "PixelReign",
    game: "League of Legends",
    role: "Mid",
    rank: "Master",
    region: "NA West",
    school: "UCLA",
    hours: 32,
    status: "Open",
    fit: 88,
    imageUrl: marketingAvatarUrl("scout-pixel-reign"),
  },
  {
    handle: "HexStrike",
    game: "Counter-Strike 2",
    role: "AWPer",
    rank: "Global",
    region: "EU West",
    school: null,
    hours: 24,
    status: "Tryouts",
    fit: 81,
    imageUrl: marketingAvatarUrl("scout-hex-strike"),
  },
  {
    handle: "SkyForge",
    game: "VALORANT",
    role: "Initiator",
    rank: "Immortal",
    region: "NA East",
    school: "Stanford",
    hours: 26,
    status: "Open",
    fit: 91,
    imageUrl: marketingAvatarUrl("scout-skyforge"),
  },
] as const;

const HOME_SCROLL_KEY = "maxime:home-scroll";

type SavedScroll = {
  y: number;
  /** Nearest [id] element whose top is at/above the viewport top. */
  id?: string;
  /** How many pixels past that element's top we had scrolled. */
  offset?: number;
};

/**
 * Element-anchored position so restoration survives layout shifts (web fonts,
 * late-mounting banners) that make a raw scrollY land slightly off.
 */
function readScrollAnchor(): SavedScroll {
  const saved: SavedScroll = { y: window.scrollY };
  let bestTop = -Infinity;
  for (const el of document.querySelectorAll<HTMLElement>(
    ".overcast-frame [id]",
  )) {
    const top = el.getBoundingClientRect().top;
    if (top <= 8 && top > bestTop) {
      bestTop = top;
      saved.id = el.id;
      saved.offset = -top;
    }
  }
  return saved;
}

function scrollTargetFor(saved: SavedScroll): number {
  if (saved.id) {
    const el = document.getElementById(saved.id);
    if (el) {
      return (
        el.getBoundingClientRect().top + window.scrollY + (saved.offset ?? 0)
      );
    }
  }
  return saved.y;
}

/** Overcast · Ink Frame — Maxime marketing home. */
export function OvercastHome({
  hashRoot = "/",
  initialSolution,
}: {
  hashRoot?: string;
  /** From server `searchParams` so this tree can SSR without useSearchParams. */
  initialSolution?: string;
} = {}) {
  useEffect(() => {
    // Own reload restoration entirely; "auto" would fight our anchor-based
    // passes with a stale pixel position.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const cleanups: Array<() => void> = [];
    const cleanup = () => {
      for (const fn of cleanups.splice(0)) fn();
    };

    const hash = window.location.hash;
    if (hash) {
      // Retry until the section exists (fonts/layout can shift first paint).
      let attempts = 0;
      let raf = 0;
      const tryJump = () => {
        if (jumpToSection(hash, hashRoot) || attempts++ > 40) return;
        raf = window.requestAnimationFrame(tryJump);
      };
      raf = window.requestAnimationFrame(tryJump);
      return () => window.cancelAnimationFrame(raf);
    }

    let restoring = false;

    let ticking = false;
    function onScroll() {
      if (restoring || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (restoring) return;
        sessionStorage.setItem(
          HOME_SCROLL_KEY,
          JSON.stringify(readScrollAnchor()),
        );
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const navType = nav?.type ?? "navigate";
    if (navType === "reload" || navType === "back_forward") {
      let saved: SavedScroll | null = null;
      try {
        saved = JSON.parse(sessionStorage.getItem(HOME_SCROLL_KEY) ?? "null");
      } catch {
        saved = null;
      }

      if (saved && (saved.y > 0 || saved.id)) {
        let done = false;

        const apply = () => {
          if (done) return;
          restoring = true;
          window.scrollTo(0, scrollTargetFor(saved));
          window.setTimeout(() => {
            restoring = false;
          }, 60);
        };

        // Stop correcting the moment the user scrolls on their own.
        const stop = () => {
          done = true;
        };
        cleanups.push(stop);
        for (const ev of ["wheel", "touchstart", "keydown"] as const) {
          window.addEventListener(ev, stop, { passive: true, once: true });
          cleanups.push(() => window.removeEventListener(ev, stop));
        }

        // Re-apply as layout settles: now, next frame, after web fonts, and
        // after the window fully loads.
        apply();
        const raf = window.requestAnimationFrame(apply);
        cleanups.push(() => window.cancelAnimationFrame(raf));

        const t = window.setTimeout(apply, 250);
        cleanups.push(() => window.clearTimeout(t));

        document.fonts?.ready.then(() => {
          window.requestAnimationFrame(apply);
        });

        if (document.readyState === "complete") {
          window.requestAnimationFrame(apply);
        } else {
          const onLoad = () => window.requestAnimationFrame(apply);
          window.addEventListener("load", onLoad, { once: true });
          cleanups.push(() => window.removeEventListener("load", onLoad));
        }
      }
    }

    return cleanup;
  }, [hashRoot]);

  return (
    <OvercastHashContext.Provider value={hashRoot}>
      <div className="overcast-frame font-body">
        <FrameNav logoHref={hashRoot} />
        <div>
          <Hero />
          <GamesRail />
          <HowItRuns />
          <Tracks initialSolution={initialSolution} />
          <FeaturesBlock />
          <Compare />
          <Faq />
          <Close />
        </div>
        <FrameFooter />
      </div>
    </OvercastHashContext.Provider>
  );
}

function FrameNav({ logoHref }: { logoHref: string }) {
  return (
    <header className="oc-nav sticky top-0 z-40 border-b border-[var(--design-line)] bg-[var(--design-bg)]/92 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={logoHref}
          className="font-display text-[1.05rem] font-medium tracking-[-0.03em] text-[var(--design-fg)]"
        >
          Maxime
        </Link>
        <nav className="hidden items-center gap-6 text-[13px] text-[var(--design-muted)] lg:flex">
          {FRAME_NAV.map((item) => (
            <HashLink key={item.href} href={item.href} className="oc-link">
              {item.label}
            </HashLink>
          ))}
          <DashboardPreviewDropdown />
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="hidden text-[13px] text-[var(--design-muted)] transition-colors hover:text-[var(--design-fg)] sm:inline"
          >
            Sign in
          </Link>
          <Link href="/sign-up" className="oc-btn oc-btn-solid">
            Create your org
          </Link>
        </div>
      </div>
    </header>
  );
}

const PREVIEW_OPTIONS: {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/preview/dashboard/manager_collegiate",
    label: "Collegiate org",
    hint: "Manager · school-bound program",
    icon: GraduationCap,
  },
  {
    href: "/preview/dashboard/manager_grassroots",
    label: "Grassroots org",
    hint: "Manager · community team",
    icon: Users,
  },
  {
    href: "/preview/dashboard/player_collegiate",
    label: "Collegiate player",
    hint: "Player · school-bound scout card",
    icon: UserRound,
  },
  {
    href: "/preview/dashboard/player_grassroots",
    label: "Grassroots player",
    hint: "Player · free agent",
    icon: Search,
  },
];

function DashboardPreviewDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="oc-link inline-flex items-center gap-1"
      >
        See the dashboard
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[19rem] border border-[var(--design-fg)] bg-[var(--design-surface)] shadow-none"
        >
          <div className="border-b border-[var(--design-line)] px-4 py-3">
            <p className="font-mono-design text-[10px] uppercase tracking-[0.18em] text-[var(--design-accent)]">
              Dashboard preview
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--design-muted)]">
              Design mock of the signed-in desk — pick an account type to see
              exactly what that user opens on Maxime.
            </p>
          </div>
          <ul>
            {PREVIEW_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <li key={opt.href} className="border-b border-[var(--design-line)] last:border-b-0">
                  <Link
                    href={opt.href}
                    role="menuitem"
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--design-bg)]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="oc-mark" aria-hidden>
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium tracking-[-0.01em] text-[var(--design-fg)]">
                        {opt.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-[var(--design-muted)]">
                        {opt.hint}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      className="oc-hero relative scroll-mt-28 overflow-hidden border-b border-[var(--design-line)]"
    >
      <div
        className="pointer-events-none absolute inset-0 oc-hero-field"
        aria-hidden
      />
      <div className="relative mx-auto grid min-h-[min(92vh,52rem)] max-w-6xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="oc-hero-copy flex flex-col justify-end px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:pb-24">
          <p className="oc-kicker oc-reveal">
            Collegiate &amp; grassroots esports
          </p>
          <h1 className="font-display oc-reveal oc-reveal-delay-1 mt-5 text-[clamp(4.25rem,14vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.055em] text-[var(--design-fg)]">
            Maxime
          </h1>
          <p className="oc-reveal oc-reveal-delay-2 mt-7 max-w-[22rem] text-[1.35rem] leading-snug tracking-[-0.02em] text-[var(--design-fg)] sm:text-[1.5rem]">
            The desk that runs your esports operations.
          </p>
          <p className="oc-reveal oc-reveal-delay-3 mt-4 max-w-[26rem] text-[0.95rem] leading-7 text-[var(--design-muted)]">
            Scout players, chase sponsors, keep the roster moving — built for
            captains who outgrew Discord pins and shared Sheets.
          </p>
          <div className="oc-reveal oc-reveal-delay-4 mt-10 flex flex-wrap items-center gap-3">
            <Link href="/sign-up" className="oc-btn oc-btn-solid oc-btn-lg">
              Create your org
              <ArrowRight className="h-4 w-4" />
            </Link>
            <HashLink href="#features" className="oc-btn oc-btn-ghost oc-btn-lg">
              See features
            </HashLink>
          </div>
        </div>

        <div
          className="oc-desk relative flex min-h-[18rem] flex-col border-t border-[var(--design-line)] lg:min-h-0 lg:border-l lg:border-t-0"
          aria-hidden
        >
          <div className="oc-desk-panel absolute inset-0" />
          <div className="relative z-[1] flex flex-1 flex-col justify-start p-4 pt-5 sm:p-6 sm:pt-6 lg:p-8 lg:pt-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <p className="font-mono-design text-[10px] uppercase tracking-[0.22em] text-[var(--design-muted)]">
                Player profiles
              </p>
              <p className="font-mono-design text-[10px] uppercase tracking-[0.18em] text-[var(--design-accent)]">
                Scout preview
              </p>
            </div>
            <ul className="flex flex-col gap-2.5">
              {PROFILE_CARDS.map((player, i) => {
                const meta = [
                  player.region,
                  player.school,
                  `${player.hours}h/wk`,
                ].filter(Boolean);
                return (
                  <li
                    key={player.handle}
                    className="oc-desk-row oc-profile-card"
                    style={{ animationDelay: `${0.28 + i * 0.07}s` }}
                  >
                    <img
                      src={player.imageUrl}
                      alt=""
                      width={44}
                      height={44}
                      className="oc-profile-photo"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-display truncate text-[0.98rem] tracking-[-0.03em] text-[var(--design-fg)] sm:text-[1.05rem]">
                          {player.handle}
                        </p>
                        <span className="oc-profile-rank shrink-0">
                          {player.rank}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[0.78rem] leading-5 text-[var(--design-muted)]">
                        <span className="text-[var(--design-fg)]">
                          {player.game}
                        </span>
                        <span className="mx-1.5 text-[var(--design-line)]">
                          ·
                        </span>
                        {player.role}
                        <span className="mx-1.5 text-[var(--design-line)]">
                          ·
                        </span>
                        <span className="text-[var(--design-accent)]">
                          {player.status}
                        </span>
                      </p>
                      <p className="mt-1 truncate font-mono-design text-[10px] uppercase tracking-[0.1em] text-[var(--design-muted)]">
                        {meta.join(" · ")}
                      </p>
                      <div className="oc-profile-fit mt-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-design text-[10px] uppercase tracking-[0.12em] text-[var(--design-muted)]">
                            Fit
                          </span>
                          <span className="font-mono-design text-[10px] tabular-nums tracking-[0.06em] text-[var(--design-accent)]">
                            {player.fit}%
                          </span>
                        </div>
                        <div
                          className="oc-profile-fit-track"
                          role="presentation"
                        >
                          <span
                            className="oc-profile-fit-fill"
                            style={{ width: `${player.fit}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function GamesRail() {
  return (
    <section className="border-b border-[var(--design-line)] bg-[var(--design-surface)]">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:gap-10 sm:px-6">
        <p className="shrink-0 font-mono-design text-[10px] uppercase tracking-[0.2em] text-[var(--design-muted)]">
          Titles on board
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-2">
          {GAMES.map((game) => (
            <span
              key={game}
              className="text-[13px] tracking-[-0.01em] text-[var(--design-fg)]"
            >
              {game}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function SectionMark({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="oc-mark" aria-hidden>
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </span>
  );
}

function HowItRuns() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-28 border-b border-[var(--design-line)] bg-[var(--design-bg)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-xl">
          <p className="oc-kicker">How it works</p>
          <h2 className="font-display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.04em] text-[var(--design-fg)]">
            Sign up after lunch. Season-ready by dinner.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-7 text-[var(--design-muted)]">
            Four moves. No analyst hire. No GM required.
          </p>
        </Reveal>
        <RevealGroup className="mt-12 divide-y divide-[var(--design-line)] border-y border-[var(--design-line)]">
          {STEPS.map((step) => (
            <RevealChild
              key={step.n}
              className="grid gap-3 py-8 sm:grid-cols-[4.5rem_2.5rem_minmax(0,14rem)_1fr] sm:items-start sm:gap-6 sm:py-9"
            >
              <span className="font-mono-design text-[12px] text-[var(--design-accent)]">
                {step.n}
              </span>
              <SectionMark icon={step.icon} />
              <h3 className="font-display text-lg tracking-[-0.03em] text-[var(--design-fg)] sm:text-xl">
                {step.title}
              </h3>
              <p className="text-[0.95rem] leading-7 text-[var(--design-muted)]">
                {step.body}
              </p>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function Tracks({ initialSolution }: { initialSolution?: string }) {
  const queryAudience =
    initialSolution === "grassroots" ? "grassroots" : "collegiate";
  const [active, setActive] = useState<string>(queryAudience);

  useEffect(() => {
    setActive(queryAudience);
  }, [queryAudience]);

  return (
    <section
      id="solutions"
      className="scroll-mt-28 border-b border-[var(--design-line)] bg-[var(--design-surface)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <p className="oc-kicker">Solutions</p>
          <h2 className="font-display mt-3 max-w-lg text-[clamp(1.85rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.04em] text-[var(--design-fg)]">
            Two kinds of orgs. One operating system.
          </h2>
        </Reveal>
      </div>
      <RevealGroup className="mx-auto grid max-w-6xl border-t border-[var(--design-line)] lg:grid-cols-2">
        {TRACKS.map((track, i) => {
          const isActive = active === track.id;
          return (
            <RevealChild
              key={track.id}
              className={cn(
                "px-4 py-12 sm:px-6 sm:py-14 lg:px-8",
                i === 1 &&
                  "border-t border-[var(--design-line)] lg:border-l lg:border-t-0",
                isActive &&
                  "bg-[color-mix(in_srgb,var(--design-accent)_4%,transparent)]",
              )}
            >
              <article id={`solution-${track.id}`}>
                <button
                  type="button"
                  onClick={() => setActive(track.id)}
                  className="flex items-center gap-3 text-left"
                >
                  <SectionMark icon={track.icon} />
                  <p className="font-mono-design text-[10px] uppercase tracking-[0.22em] text-[var(--design-accent)]">
                    {track.label}
                  </p>
                </button>
                <h3 className="font-display mt-4 max-w-sm text-2xl leading-snug tracking-[-0.035em] text-[var(--design-fg)]">
                  {track.title}
                </h3>
                <ul className="mt-8 space-y-3">
                  {track.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-[0.95rem] leading-6 text-[var(--design-muted)]"
                    >
                      <span
                        className="mt-2.5 h-px w-4 shrink-0 bg-[var(--design-accent)]"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="oc-inline-cta mt-10 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--design-fg)]"
                >
                  Start on {track.label.toLowerCase()}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            </RevealChild>
          );
        })}
      </RevealGroup>
    </section>
  );
}

function FeaturesBlock() {
  return (
    <section
      id="features"
      className="oc-features scroll-mt-28 border-b border-[var(--design-line)] bg-[var(--design-bg)]"
    >
      <div className="border-b border-[var(--design-line)] px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="mx-auto max-w-6xl">
          <p className="oc-kicker">Features</p>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.85rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.04em] text-[var(--design-fg)]">
            Everything on the platform
          </h2>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-[var(--design-muted)]">
            The same product surfaces as production Maxime — managers, players,
            and what&apos;s on the roadmap. What you unlock after signup depends
            on track and role.
          </p>
        </Reveal>
      </div>

      <FeaturesNav />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6 sm:py-16">
        <FeatureGroup
          id="features-managers"
          label="For team managers"
          features={MANAGER_FEATURES}
        />
        <FeatureGroup
          id="features-players"
          label="For players"
          features={PLAYER_FEATURES}
        />
        <div id="features-roadmap">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono-design text-[10px] uppercase tracking-[0.2em] text-[var(--design-muted)]">
                On the roadmap
              </p>
              <span className="inline-flex items-center gap-1.5 border border-[var(--design-line)] px-2 py-0.5 font-mono-design text-[10px] uppercase tracking-[0.14em] text-[var(--design-accent)]">
                <Clock className="h-3 w-3" />
                Coming soon
              </span>
            </div>
            <p className="mt-2 max-w-lg text-[0.9rem] leading-6 text-[var(--design-muted)]">
              Still in development — not available yet. Here&apos;s what&apos;s
              next.
            </p>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROADMAP_FEATURES.map((card) => (
              <RevealChild key={card.id} className="h-full">
                <FeatureModule card={card} muted />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

function FeaturesNav() {
  return (
    <nav
      className="oc-features-nav sticky top-14 z-30 border-b border-[var(--design-line)] bg-[var(--design-surface)]/95 backdrop-blur-sm"
      aria-label="Features sections"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
        {FEATURE_NAV.map((item) => (
          <HashLink
            key={item.href}
            href={item.href}
            className="oc-features-nav-link"
          >
            {item.label}
          </HashLink>
        ))}
      </div>
    </nav>
  );
}

function FeatureGroup({
  id,
  label,
  features,
}: {
  id: string;
  label: string;
  features: FeatureCard[];
}) {
  return (
    <div id={id}>
      <Reveal>
        <p className="mb-5 font-mono-design text-[10px] uppercase tracking-[0.2em] text-[var(--design-muted)]">
          {label}
        </p>
      </Reveal>
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((card) => (
          <RevealChild key={card.id} className="h-full">
            <FeatureModule card={card} />
          </RevealChild>
        ))}
      </RevealGroup>
    </div>
  );
}

function FeatureModule({
  card,
  muted = false,
}: {
  card: FeatureCard;
  muted?: boolean;
}) {
  return (
    <article
      className={cn(
        "oc-feature-module flex h-full flex-col bg-[var(--design-bg)] p-3 transition-colors",
        muted && "opacity-80",
      )}
    >
      <div className="oc-feature-art">{card.illustration}</div>
      <div className="flex flex-1 flex-col px-1 pt-3 pb-1">
        <h3 className="font-display text-[0.95rem] tracking-[-0.02em] text-[var(--design-fg)]">
          {card.title}
        </h3>
        <p className="mt-1.5 flex-1 text-[12px] leading-5 text-[var(--design-muted)]">
          {card.description}
        </p>
        <p className="mt-2 font-mono-design text-[10px] uppercase tracking-[0.14em] text-[var(--design-accent)]">
          {card.access}
        </p>
      </div>
    </article>
  );
}

function Compare() {
  return (
    <section
      id="compare"
      className="scroll-mt-28 border-b border-[var(--design-line)] bg-[var(--design-bg)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-lg">
          <p className="oc-kicker">Why Maxime</p>
          <h2 className="font-display mt-3 text-[clamp(1.85rem,4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.04em] text-[var(--design-fg)]">
            League sites run matches. Spreadsheets run orgs — until Maxime.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-7 text-[var(--design-muted)]">
            The real competitor is a Google Sheet pinned in Discord. This is what
            replaces it.
          </p>
        </Reveal>

        <Reveal className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--design-line)]">
                <th className="pb-3 pr-4 font-mono-design text-[10px] font-normal uppercase tracking-[0.18em] text-[var(--design-muted)]">
                  Capability
                </th>
                <th className="pb-3 px-3 text-center font-mono-design text-[10px] font-normal uppercase tracking-[0.18em] text-[var(--design-accent)]">
                  Maxime
                </th>
                <th className="pb-3 pl-3 text-center font-mono-design text-[10px] font-normal uppercase tracking-[0.18em] text-[var(--design-muted)]">
                  Status quo
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-[var(--design-line)]"
                >
                  <td className="py-4 pr-4 text-[0.95rem] text-[var(--design-fg)]">
                    {row.label}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <CellMark value={row.maxime} accent />
                  </td>
                  <td className="py-4 pl-3 text-center">
                    <CellMark value={row.others} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

function CellMark({ value, accent = false }: { value: Cell; accent?: boolean }) {
  const label = value === "yes" ? "Yes" : value === "partial" ? "Partial" : "No";
  return (
    <span
      className={cn(
        "font-mono-design text-[11px] uppercase tracking-[0.12em]",
        accent && value === "yes"
          ? "text-[var(--design-accent)]"
          : "text-[var(--design-muted)]",
      )}
    >
      {label}
    </span>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-28 border-b border-[var(--design-line)] bg-[var(--design-surface)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <p className="oc-kicker">FAQ</p>
          <h2 className="font-display mt-3 text-[clamp(1.85rem,4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.04em] text-[var(--design-fg)]">
            Before you create the org
          </h2>
        </Reveal>
        <RevealGroup className="mt-10 divide-y divide-[var(--design-line)] border-y border-[var(--design-line)]">
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            return (
              <RevealChild key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-base tracking-[-0.02em] text-[var(--design-fg)] sm:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-1 h-4 w-4 shrink-0 text-[var(--design-muted)] transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-[0.95rem] leading-7 text-[var(--design-muted)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </RevealChild>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="bg-[var(--design-fg)] py-16 text-[var(--design-bg)] sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono-design text-[10px] uppercase tracking-[0.22em] text-[var(--design-accent)]">
          Start here
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.045em]">
          Put the org on Maxime before next week&apos;s scrims.
        </h2>
        <p className="mt-5 max-w-md text-[0.95rem] leading-7 text-white/55">
          Captains scout and invite. Players get discovered. Sponsors stop living
          in a forgotten tab.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/sign-up" className="oc-btn oc-btn-on-dark oc-btn-lg">
            Create your org
            <ArrowRight className="h-4 w-4" />
          </Link>
          <HashLink
            href="#features"
            className="oc-btn oc-btn-ghost-on-dark oc-btn-lg"
          >
            Browse features
          </HashLink>
        </div>
      </Reveal>
    </section>
  );
}

function FrameFooter() {
  return (
    <footer className="border-t border-[var(--design-line)] bg-[var(--design-bg)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg tracking-[-0.03em] text-[var(--design-fg)]">
            Maxime
          </p>
          <p className="mt-2 max-w-xs text-[13px] leading-6 text-[var(--design-muted)]">
            Operating system for collegiate and grassroots esports orgs.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[var(--design-muted)]">
          {FRAME_NAV.map((item) => (
            <HashLink key={item.href} href={item.href} className="oc-link">
              {item.label}
            </HashLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
