"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Bookmark, MessageSquare, Sparkles } from "lucide-react";
import type { Player } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { GradientAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function fitTone(score: number) {
  if (score >= 90) return "ring-cyan-400/40 text-cyan-300 bg-cyan-400/10";
  if (score >= 80) return "ring-violet-400/40 text-violet-300 bg-violet-400/10";
  if (score >= 70) return "ring-amber-400/40 text-amber-300 bg-amber-400/10";
  return "ring-zinc-400/30 text-zinc-300 bg-zinc-400/10";
}

export function PlayerCard({ player, index }: { player: Player; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      className="group relative flex flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-5 transition-all hover:border-cyan-400/30 hover:bg-[var(--surface-2)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <GradientAvatar hue={player.avatarHue} label={player.handle} size={48} />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-semibold text-white">
                {player.handle}
              </h3>
              {player.verified && (
                <BadgeCheck className="h-4 w-4 text-cyan-400" />
              )}
            </div>
            <p className="text-xs text-zinc-500">
              {player.game} · {player.role}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-xl px-2.5 py-1.5 ring-1 ring-inset",
            fitTone(player.fitScore),
          )}
        >
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider opacity-80">
            <Sparkles className="h-3 w-3" /> Fit
          </span>
          <span className="text-lg font-semibold leading-none">
            {player.fitScore}
          </span>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 rounded-lg bg-white/[0.02] p-3 text-center">
        <Stat label="Rank" value={player.rank} />
        <Stat label="Win rate" value={`${Math.round(player.winRate * 100)}%`} />
        <Stat label="KDA" value={player.kda.toFixed(2)} />
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Badge tone="zinc">{player.region}</Badge>
        {player.school && <Badge tone="zinc">{player.school}</Badge>}
        <Badge tone={player.status === "Available" ? "green" : "amber"}>
          {player.status}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {player.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-400"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
        <button className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white">
          <Bookmark className="h-3.5 w-3.5" />
          Shortlist
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-cyan-300">
          <MessageSquare className="h-3.5 w-3.5" />
          Request intro
        </button>
      </div>
    </motion.article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
