import { ExternalLink } from "lucide-react";
import type { SponsorListing } from "@/lib/sponsor-listing";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";
import { SponsorLeadActions } from "@/components/sponsorships/sponsor-lead-actions";
import { Badge } from "@/components/ui/badge";

function difficultyTone(difficulty: string) {
  const d = difficulty.toLowerCase();
  if (d.includes("starter") || d.includes("easy")) return "amber" as const;
  if (d.includes("growth") || d.includes("medium")) return "cyan" as const;
  return "violet" as const;
}

/** Sponsor listing card — roomy layout, same fields as directory data. */
export function SponsorDirectoryCard({
  sponsor,
  tag,
  lead,
  showPipeline = false,
}: {
  sponsor: SponsorListing;
  tag?: string;
  lead?: SponsorLeadRecord | null;
  showPipeline?: boolean;
}) {
  return (
    <article className="group flex min-h-[11.5rem] flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-7 transition-colors hover:border-cyan-400/20 sm:min-h-[12.5rem] sm:p-8">
      {tag && (
        <span className="mb-3 inline-block rounded-full bg-zinc-500/10 px-2.5 py-1 text-xs text-zinc-400 ring-1 ring-inset ring-white/10">
          {tag}
        </span>
      )}
      <h3 className="font-heading text-xl font-semibold leading-snug text-white group-hover:text-cyan-100 sm:text-2xl">
        {sponsor.name}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-zinc-400">{sponsor.industry}</p>

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge tone={difficultyTone(sponsor.difficulty)} className="text-xs">
            {sponsor.difficulty}
          </Badge>
          {sponsor.sponsorLink !== "#" ? (
            <a
              href={sponsor.sponsorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
            >
              View application
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="text-sm text-zinc-600">No link</span>
          )}
        </div>
        {showPipeline && (
          <SponsorLeadActions sponsor={sponsor} lead={lead} compact />
        )}
      </div>
    </article>
  );
}
