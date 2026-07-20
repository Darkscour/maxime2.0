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
  showPipeline = false,
}: {
  sponsor: SponsorListing;
  showAi?: boolean;
  tag?: string;
  lead?: SponsorLeadRecord | null;
  showPipeline?: boolean;
}) {
  return (
    <article className="relative flex flex-col rounded-none border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] hover:bg-[var(--surface-2)]">
      {tag && (
        <span className="absolute right-3 top-3 rounded-none bg-[color-mix(in_srgb,var(--foreground-muted)_10%,transparent)] px-2 py-0.5 text-[10px] text-[var(--foreground-muted)] ring-1 ring-inset ring-[var(--border)]">
          {tag}
        </span>
      )}

      <h3 className="font-heading pr-16 text-base font-semibold text-[var(--foreground)]">
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
              className="inline-flex items-center gap-1 text-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              View application
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[var(--foreground-muted)]">—</span>
          )}
        </Row>
        <Row label="Sponsorship difficulty">
          <Badge tone={difficultyTone(sponsor.difficulty)}>
            {sponsor.difficulty}
          </Badge>
        </Row>
      </dl>

      {showPipeline && <SponsorLeadActions sponsor={sponsor} lead={lead} />}

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
      <dt className="w-36 shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
        {label}
      </dt>
      <dd className="text-[var(--foreground-muted)]">{children ?? value}</dd>
    </div>
  );
}
