import { ExternalLink } from "lucide-react";
import type { SponsorListing } from "@/lib/sponsor-listing";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";
import {
  SPONSOR_LEAD_STATUS_LABELS,
  type SponsorLeadStatus,
} from "@/lib/sponsor-fit";
import { InstitutionLogoWithFallback } from "@/components/onboarding/institution-logo";
import { SponsorLeadActions } from "@/components/sponsorships/sponsor-lead-actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function difficultyTone(difficulty: string) {
  const d = difficulty.toLowerCase();
  if (d.includes("starter") || d.includes("easy")) return "amber" as const;
  if (d.includes("growth") || d.includes("medium")) return "cyan" as const;
  return "violet" as const;
}

function formatRegions(regions: string[]) {
  if (regions.length <= 2) return regions.join(", ");
  return `${regions.slice(0, 2).join(", ")} +${regions.length - 2}`;
}

function SponsorCardDetails({
  sponsor,
  compact = false,
}: {
  sponsor: SponsorListing;
  compact?: boolean;
}) {
  const hasMeta =
    sponsor.description ||
    sponsor.checkSize ||
    sponsor.regions.length > 0 ||
    sponsor.games.length > 0 ||
    sponsor.audience;

  if (!hasMeta) return null;

  const visibleGames = sponsor.games.slice(0, compact ? 3 : 4);
  const extraGames = sponsor.games.length - visibleGames.length;

  return (
    <div className="mt-3 flex flex-1 flex-col">
      {sponsor.description && (
        <p
          className={cn(
            "leading-relaxed text-[var(--foreground-muted)]",
            compact ? "line-clamp-2 text-sm" : "line-clamp-3 text-sm sm:text-[15px]",
          )}
        >
          {sponsor.description}
        </p>
      )}

      <dl className={cn("space-y-1.5", compact ? "mt-3 text-sm" : "mt-4 text-sm")}>
        {sponsor.checkSize && (
          <MetaRow label="Typical deal" value={sponsor.checkSize} />
        )}
        {sponsor.regions.length > 0 && (
          <MetaRow label="Regions" value={formatRegions(sponsor.regions)} />
        )}
        {sponsor.audience && (
          <MetaRow label="Audience" value={sponsor.audience} />
        )}
      </dl>

      {visibleGames.length > 0 && (
        <div className={cn("flex flex-wrap gap-1", compact ? "mt-2.5" : "mt-3")}>
          {visibleGames.map((game) => (
            <span
              key={game}
              className="rounded-none bg-[var(--background)] px-1.5 py-0.5 text-[11px] text-[var(--foreground-muted)] ring-1 ring-inset ring-[var(--border)]"
            >
              {game}
            </span>
          ))}
          {extraGames > 0 && (
            <span className="rounded-none bg-[var(--background)] px-1.5 py-0.5 text-[11px] text-[var(--foreground-muted)] ring-1 ring-inset ring-[var(--border)]">
              +{extraGames}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[var(--foreground-muted)]">{label}</dt>
      <dd className="min-w-0 truncate text-[var(--foreground-muted)]">{value}</dd>
    </div>
  );
}

function LeadStatusPill({ lead }: { lead: SponsorLeadRecord }) {
  return (
    <span className="inline-flex items-center rounded-none bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-2 py-0.5 text-[10px] font-medium text-[var(--success)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--success)_20%,transparent)]">
      {SPONSOR_LEAD_STATUS_LABELS[lead.status as SponsorLeadStatus]}
    </span>
  );
}

export function SponsorDirectoryCard({
  sponsor,
  tag,
  lead,
  showPipeline = false,
  compact = false,
}: {
  sponsor: SponsorListing;
  tag?: string;
  lead?: SponsorLeadRecord | null;
  showPipeline?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <article className="group flex min-h-[15.5rem] flex-col rounded-none border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--accent)_20%,var(--border))]">
        {tag && (
          <span className="mb-2 inline-block rounded-none bg-[color-mix(in_srgb,var(--foreground-muted)_10%,transparent)] px-2 py-0.5 text-[10px] text-[var(--foreground-muted)] ring-1 ring-inset ring-[var(--border)]">
            {tag}
          </span>
        )}

        <div className="flex items-center gap-3">
          <InstitutionLogoWithFallback
            name={sponsor.name}
            logoUrl={sponsor.logoUrl}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-heading truncate text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
              {sponsor.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-[var(--foreground-muted)]">{sponsor.industry}</p>
          </div>
        </div>

        <SponsorCardDetails sponsor={sponsor} compact />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={difficultyTone(sponsor.difficulty)} className="text-xs">
              {sponsor.difficulty}
            </Badge>
            {showPipeline && lead && <LeadStatusPill lead={lead} />}
          </div>
          {sponsor.sponsorLink !== "#" ? (
            <a
              href={sponsor.sponsorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              Apply
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-sm text-[var(--foreground-muted)]">No link</span>
          )}
        </div>

        {showPipeline && (
          <div className="mt-3.5 border-t border-[var(--border)] pt-3">
            <SponsorLeadActions sponsor={sponsor} lead={lead} compact />
          </div>
        )}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex min-h-[18rem] flex-col rounded-none border border-[var(--border)] bg-[var(--surface)] p-7 transition-colors hover:border-[color-mix(in_srgb,var(--accent)_20%,var(--border))] sm:min-h-[19rem] sm:p-8",
      )}
    >
      {tag && (
        <span className="mb-3 inline-block rounded-none bg-[color-mix(in_srgb,var(--foreground-muted)_10%,transparent)] px-2.5 py-1 text-xs text-[var(--foreground-muted)] ring-1 ring-inset ring-[var(--border)]">
          {tag}
        </span>
      )}

      <div className="flex items-center gap-3">
        <InstitutionLogoWithFallback
          name={sponsor.name}
          logoUrl={sponsor.logoUrl}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-xl font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--accent)] sm:text-2xl">
            {sponsor.name}
          </h3>
          <p className="mt-1 text-base text-[var(--foreground-muted)]">{sponsor.industry}</p>
        </div>
      </div>

      <SponsorCardDetails sponsor={sponsor} />

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={difficultyTone(sponsor.difficulty)} className="text-xs">
              {sponsor.difficulty}
            </Badge>
            {showPipeline && lead && <LeadStatusPill lead={lead} />}
          </div>
          {sponsor.sponsorLink !== "#" ? (
            <a
              href={sponsor.sponsorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              View application
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="text-sm text-[var(--foreground-muted)]">No link</span>
          )}
        </div>
        {showPipeline && (
          <SponsorLeadActions sponsor={sponsor} lead={lead} compact />
        )}
      </div>
    </article>
  );
}
