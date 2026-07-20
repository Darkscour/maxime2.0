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
  if (score >= 90) return "text-[var(--success)]";
  if (score >= 85) return "text-[var(--accent)]";
  return "text-[var(--accent-2)]";
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
    <article className="relative flex flex-col rounded-none border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] hover:bg-[var(--surface-2)]">
      {tag && (
        <span className="absolute right-3 top-3 rounded-none bg-[color-mix(in_srgb,var(--foreground-muted)_10%,transparent)] px-2 py-0.5 text-[10px] text-[var(--foreground-muted)] ring-1 ring-inset ring-[var(--border)]">
          {tag}
        </span>
      )}

      <h3 className="font-heading pr-16 text-base font-semibold text-[var(--foreground)]">
        {player.handle}
      </h3>

      <dl className="mt-4 space-y-2.5 text-sm">
        <Row label="Game" value={player.game} />
        <Row label="Role" value={player.role} />
        <Row label="Rank" value={player.rank} />
        <Row label="Region" value={player.region} />
        <Row label="School" value={player.school || "—"} />
      </dl>

      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={statusTone(player.status)} className="text-[10px]">
            {player.status}
          </Badge>
          {player.verified && (
            <span className="inline-flex items-center gap-1 rounded-none bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_25%,transparent)]">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>

        <span
          className={cn(
            "mt-2 inline-flex items-center gap-1 rounded-none bg-[var(--background)] px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ring-[var(--border)]",
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
      <dt className="w-24 shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
        {label}
      </dt>
      <dd className="text-[var(--foreground-muted)]">{value}</dd>
    </div>
  );
}
