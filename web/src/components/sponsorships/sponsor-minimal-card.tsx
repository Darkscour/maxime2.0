"use client";

import { ExternalLink } from "lucide-react";
import type { SponsorListing } from "@/lib/sponsor-listing";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";
import { Badge } from "@/components/ui/badge";
import { SponsorAiAdvisor } from "./sponsor-ai-advisor";
import { SponsorLeadActions } from "./sponsor-lead-actions";

function difficultyTone(difficulty: string) {
  const d = difficulty.toLowerCase();
  if (d.includes("starter") || d.includes("easy")) return "amber" as const;
  if (d.includes("growth") || d.includes("medium")) return "cyan" as const;
  return "violet" as const;
}

export function SponsorMinimalCard({
  sponsor,
  showAi = true,
  tag,
  lead,
  fitScore,
  fitReason,
  showPipeline = false,
}: {
  sponsor: SponsorListing;
  showAi?: boolean;
  tag?: string;
  lead?: SponsorLeadRecord | null;
  fitScore?: number;
  fitReason?: string;
  showPipeline?: boolean;
}) {
  return (
    <article className="relative flex flex-col rounded-xl border border-white/5 bg-[var(--surface)] p-5 transition-colors hover:border-cyan-400/25 hover:bg-[var(--surface-2)]">
      {tag && (
        <span className="absolute right-3 top-3 rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-inset ring-white/10">
          {tag}
        </span>
      )}

      <h3 className="font-heading pr-16 text-base font-semibold text-white">
        {sponsor.name}
      </h3>

      <dl className="mt-4 space-y-2.5 text-sm">
        <Row label="Industry" value={sponsor.industry} />
        <Row label="Sponsorship link">
          {sponsor.sponsorLink !== "#" ? (
            <a
              href={sponsor.sponsorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
            >
              View application
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-zinc-500">—</span>
          )}
        </Row>
        <Row label="Sponsorship difficulty">
          <Badge tone={difficultyTone(sponsor.difficulty)}>
            {sponsor.difficulty}
          </Badge>
        </Row>
      </dl>

      {showPipeline && (
        <SponsorLeadActions
          sponsor={sponsor}
          lead={lead}
          fitScore={fitScore}
          fitReason={fitReason}
        />
      )}

      {showAi && <SponsorAiAdvisor sponsor={sponsor} />}
    </article>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="w-36 shrink-0 text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="text-zinc-300">{children ?? value}</dd>
    </div>
  );
}
