"use client";

import { BadgeCheck, Shield } from "lucide-react";
import type { PlayerListing } from "@/lib/player-listing";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function statusTone(status: PlayerListing["status"]) {
  if (status === "Available") return "green" as const;
  if (status === "Open to offers") return "cyan" as const;
  return "zinc" as const;
}

function fitTone(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 85) return "text-cyan-400";
  return "text-violet-300";
}

/** Compact player card — avatar header + stat grid + status footer (sponsor shell). */
export function PlayerDemoCard({
  player,
  tag = "Demo",
}: {
  player: PlayerListing;
  tag?: string;
}) {
  const initial = player.handle.charAt(0).toUpperCase();

  return (
    <article className="relative flex flex-col rounded-xl border border-white/5 bg-[var(--surface)] p-4 transition-colors hover:border-cyan-400/25 hover:bg-[var(--surface-2)]">
      {tag && (
        <span className="absolute right-2.5 top-2.5 rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-inset ring-white/10">
          {tag}
        </span>
      )}

      <div className="flex items-center gap-2.5 pr-14">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-zinc-950"
          style={{
            background: `linear-gradient(135deg, hsl(${player.avatarHue} 70% 55%), hsl(${(player.avatarHue + 40) % 360} 60% 45%))`,
          }}
        >
          {initial}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading truncate text-sm font-semibold text-white">
              {player.handle}
            </h3>
            {player.verified && (
              <BadgeCheck
                className="h-3.5 w-3.5 shrink-0 text-cyan-400"
                aria-label="Verified player"
              />
            )}
          </div>
          {player.school && (
            <p className="truncate text-[11px] text-zinc-500">{player.school}</p>
          )}
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <Stat label="Game" value={player.game} />
        <Stat label="Role" value={player.role} />
        <Stat label="Rank" value={player.rank} />
        <Stat label="Region" value={player.region} />
        <Stat label="Win rate" value={`${Math.round(player.winRate * 100)}%`} />
        <Stat label="Hours/wk" value={String(player.hoursPerWeek)} />
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-3">
        <Badge tone={statusTone(player.status)} className="text-[10px]">
          {player.status}
        </Badge>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ring-white/10",
            fitTone(player.fitScore),
          )}
        >
          <Shield className="h-3 w-3" />
          Fit {player.fitScore}
        </span>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="mt-0.5 truncate font-medium text-zinc-200">{value}</dd>
    </div>
  );
}
