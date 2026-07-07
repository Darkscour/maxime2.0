"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/home/section-header";
import {
  ManagerDashboardPreview,
  type MarketingDashboardView,
} from "@/components/marketing/manager-dashboard-preview";

/** Desktop layout width — preview renders at this size, then scales to fit the frame. */
const DEMO_CANVAS_WIDTH = 1280;

type SidebarNavTarget = "scout" | "watchlist" | "roster";

const demoSteps = [
  {
    id: "overview",
    label: "Team manager overview",
    caption: "See roster health, watchlist momentum, and workspace status at a glance.",
    activeView: "overview" as MarketingDashboardView,
    region: null as string | null,
    sidebarNav: null as SidebarNavTarget | null,
  },
  {
    id: "analytics",
    label: "Analytics",
    caption: "Track roster growth and scouting activity with weekly and all-time graphs.",
    activeView: "analytics" as MarketingDashboardView,
    region: "analytics",
    sidebarNav: null,
  },
  {
    id: "scout",
    label: "Scout players",
    caption: "Browse players who opted in to be scouted, then invite them in one click.",
    activeView: "scout" as MarketingDashboardView,
    region: null,
    sidebarNav: "scout" as SidebarNavTarget,
  },
  {
    id: "watchlist",
    label: "Watchlist",
    caption: "Save and prioritize candidates you're tracking before you reach out.",
    activeView: "watchlist" as MarketingDashboardView,
    region: null,
    sidebarNav: "watchlist" as SidebarNavTarget,
  },
  {
    id: "roster",
    label: "Roster hub",
    caption: "Manage every player, coach, and staff member across your org in one place.",
    activeView: "roster" as MarketingDashboardView,
    region: null,
    sidebarNav: "roster" as SidebarNavTarget,
  },
];

const SIDEBAR_CLICK_DELAY_MS = 850;
const DEMO_STEP_INTERVAL_MS = 3800;

/** Layout position of a region relative to the transformed canvas root. */
function measureRegion(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function toViewportPoint(
  contentX: number,
  contentY: number,
  box: { scale: number; x: number; y: number },
) {
  return {
    x: box.x + box.scale * contentX,
    y: box.y + box.scale * contentY,
  };
}

function DemoCursor({
  x,
  y,
  clicking,
  visible,
}: {
  x: number;
  y: number;
  clicking: boolean;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-30"
      animate={{ x, y, scale: clicking ? 0.88 : 1 }}
      transition={{
        x: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.12 },
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-lg"
        aria-hidden
      >
        <path
          d="M5.5 3.5L18 11.5L11.5 13.5L9.5 20.5L5.5 3.5Z"
          fill="white"
          stroke="#0a0c10"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <AnimatePresence>
        {clicking ? (
          <motion.span
            initial={{ scale: 0.4, opacity: 0.7 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute left-1 top-1 h-4 w-4 rounded-full bg-cyan-400/50"
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function DashboardDemo() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 0.7, x: 0, y: 0 });
  const [activeStep, setActiveStep] = useState(0);
  const [displayView, setDisplayView] = useState<MarketingDashboardView>("overview");
  const [playing, setPlaying] = useState(true);
  const [cursor, setCursor] = useState({
    visible: false,
    clicking: false,
    x: 0,
    y: 0,
  });

  const step = demoSteps[activeStep];

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const fitScale = vw / DEMO_CANVAS_WIDTH;
    const currentStep = demoSteps[activeStep];
    const region = currentStep.region;

    if (!region) {
      setBox({ scale: fitScale, x: 0, y: 0 });
      return;
    }

    const el = content.querySelector<HTMLElement>(
      `[data-demo-region="${region}"]`,
    );
    if (!el) {
      setBox({ scale: fitScale, x: 0, y: 0 });
      return;
    }

    const r = measureRegion(el, content);
    const scale = Math.max(
      0.4,
      Math.min(2.2, Math.min(vw / r.w, vh / r.h) * 0.9),
    );
    setBox({
      scale,
      x: vw / 2 - scale * (r.x + r.w / 2),
      y: vh / 2 - scale * (r.y + r.h / 2),
    });
  }, [activeStep, displayView]);

  useEffect(() => {
    const currentStep = demoSteps[activeStep];
    const navTarget = currentStep.sidebarNav;

    if (!navTarget) {
      setDisplayView(currentStep.activeView);
      setCursor((c) => ({ ...c, visible: false, clicking: false }));
      return;
    }

    setCursor((c) => ({ ...c, visible: true, clicking: false }));

    const content = contentRef.current;
    const viewport = viewportRef.current;
    if (content && viewport) {
      const navEl = content.querySelector<HTMLElement>(
        `[data-demo-nav="${navTarget}"]`,
      );
      if (navEl) {
        const r = measureRegion(navEl, content);
        const fitScale = viewport.clientWidth / DEMO_CANVAS_WIDTH;
        const nextBox = { scale: fitScale, x: 0, y: 0 };
        const target = toViewportPoint(
          r.x + r.w * 0.55,
          r.y + r.h * 0.55,
          nextBox,
        );
        const start = toViewportPoint(
          r.x + r.w + 48,
          r.y + r.h * 0.4,
          nextBox,
        );
        setCursor({ visible: true, clicking: false, x: start.x, y: start.y });
        requestAnimationFrame(() => {
          setCursor({ visible: true, clicking: false, x: target.x, y: target.y });
        });
      }
    }

    const clickTimer = window.setTimeout(() => {
      setCursor((c) => ({ ...c, clicking: true }));
    }, 620);

    const switchTimer = window.setTimeout(() => {
      setDisplayView(currentStep.activeView);
      setCursor((c) => ({ ...c, clicking: false }));
    }, SIDEBAR_CLICK_DELAY_MS);

    return () => {
      window.clearTimeout(clickTimer);
      window.clearTimeout(switchTimer);
    };
  }, [activeStep]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % demoSteps.length);
    }, DEMO_STEP_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  const isOverviewLike =
    displayView === "overview" || displayView === "analytics";

  return (
    <section
      id="demo"
      className="scroll-mt-24 border-b border-white/5 py-10 sm:py-12"
    >
      <Container>
        <SectionHeader
          eyebrow="Product demo"
          title="Walk through a team manager dashboard"
          subtitle="Scout players, monitor pipeline health, and run your org from one workspace — no spreadsheets required."
        />

        <motion.div
          className="mx-auto mt-7 max-w-4xl overflow-hidden rounded-2xl border border-white/5 bg-[var(--surface)] shadow-2xl shadow-black/20"
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={viewportRef}
            className="relative aspect-[16/9] overflow-hidden bg-[var(--background)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[var(--background)]/90 via-[var(--background)]/40 to-transparent" />
            <button
              type="button"
              aria-label={playing ? "Pause tour" : "Play tour"}
              onClick={() => setPlaying((value) => !value)}
              className="absolute right-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-100 backdrop-blur transition-colors hover:border-white/25 hover:text-white"
            >
              {playing ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Play
                </>
              )}
            </button>

            <motion.div
              ref={contentRef}
              className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
              style={{ width: DEMO_CANVAS_WIDTH }}
              animate={{ scale: box.scale, x: box.x, y: box.y }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <ManagerDashboardPreview
                activeView={displayView}
                showAnalytics={isOverviewLike}
                showStatCards={isOverviewLike}
                className="w-[1280px] min-w-[1280px] shrink-0 rounded-none border-0"
              />
            </motion.div>

            <DemoCursor
              visible={cursor.visible}
              clicking={cursor.clicking}
              x={cursor.x}
              y={cursor.y}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent px-4 pb-4 pt-16 sm:px-6 sm:pb-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base"
                >
                  {step.caption}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/5 px-4 py-3 sm:px-5">
            {demoSteps.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveStep(index);
                  setPlaying(false);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  index === activeStep
                    ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/30"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
