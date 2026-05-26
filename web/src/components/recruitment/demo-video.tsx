"use client";

import { motion } from "framer-motion";
import { Play, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Embedded demo video for the recruitment overview page.
 *
 * Drop your recording at `web/public/recruitment-demo.mp4` (any standard
 * MP4 / H.264 file works). An optional poster image can live at
 * `web/public/recruitment-demo-poster.png` — if it's missing the gradient
 * frame below shows instead.
 */
export function RecruitmentDemoVideo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="cyan">
            <Video className="h-3.5 w-3.5" /> Product demo
          </Badge>
          <h2 className="font-heading mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            See how searching for players will work
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            A short walkthrough of the filtering experience teams will use to
            shortlist candidates by game, region, rank, and play style.
          </p>
        </div>
      </div>

      <div className="gradient-border rounded-2xl bg-[var(--surface)]/80 p-2 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black">
          <div className="aspect-video w-full">
            <video
              className="h-full w-full"
              controls
              preload="metadata"
              playsInline
              poster="/recruitment-demo-poster.png"
            >
              <source src="/recruitment-demo.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          </div>

          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div className="rounded-full bg-cyan-400/10 p-4 ring-1 ring-inset ring-cyan-400/30 opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-6 w-6 text-cyan-300" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-500">
        Demo recorded from a development build. Player data shown is
        placeholder for illustration only.
      </p>
    </motion.div>
  );
}
