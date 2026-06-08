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

/** Recruitment preview card styled to match sponsorship minimal cards. */
export function PlayerDemoCard({
  player,
  tag = "Demo",
}: {
  player: PlayerListing;
  tag?: string;
}) {
  return (
    <article className="relative flex flex-col rounded-xl border border-white/5 bg-[var(--surface)] p-5 transition-colors hover:border-cyan-400/25 hover:bg-[var(--surface-2)]">
      {tag && (
        <span className="absolute right-3 top-3 rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-inset ring-white/10">
          {tag}
        </span>
      )}

      <h3 className="font-heading pr-16 text-base font-semibold text-white">
        {player.handle}
      </h3>

      <dl className="mt-4 space-y-2.5 text-sm">
        <Row label="Game" value={player.game} />
        <Row label="Role" value={player.role} />
        <Row label="Rank" value={player.rank} />
        <Row label="Region" value={player.region} />
        <Row label="School" value={player.school || "—"} />
      </dl>

      <div className="mt-5 border-t border-white/5 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={statusTone(player.status)} className="text-[10px]">
            {player.status}
          </Badge>
          {player.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300 ring-1 ring-inset ring-cyan-400/25">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>

        <span
          className={cn(
            "mt-2 inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ring-white/10",
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="w-24 shrink-0 text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="text-zinc-300">{value}</dd>
    </div>
  );
}
