"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Mail,
  Sparkles,
  Bookmark,
  Building2,
  Lock,
} from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import type { Sponsor } from "@/lib/mock-data";
import { sponsorToListing } from "@/lib/sponsor-listing";
import { Badge } from "@/components/ui/badge";
import { SponsorAiAdvisor } from "./sponsor-ai-advisor";
import { cn } from "@/lib/utils";

function tierTone(tier: Sponsor["tier"]) {
  if (tier === "Established") return "violet" as const;
  if (tier === "Growth") return "cyan" as const;
  return "amber" as const;
}

export function SponsorCard({
  sponsor,
  index,
  previewMode = false,
}: {
  sponsor: Sponsor;
  index: number;
  previewMode?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      className="group relative flex flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-6 transition-all hover:border-violet-400/30 hover:bg-[var(--surface-2)]"
    >
      {previewMode && (
        <span className="absolute right-4 top-4 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-200 ring-1 ring-inset ring-amber-400/30">
          Sample
        </span>
      )}

      <div className="flex items-start gap-4">
        <BrandMark hue={sponsor.brandHue} name={sponsor.name} />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading truncate text-base font-semibold text-white">
            {sponsor.name}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">{sponsor.industry}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone={tierTone(sponsor.tier)}>{sponsor.tier}</Badge>
            <Badge tone="zinc">{sponsor.checkSize}</Badge>
          </div>
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-400">
        {sponsor.description}
      </p>

      <dl className="mt-5 grid grid-cols-1 gap-2 rounded-lg bg-white/[0.02] p-3 text-xs sm:grid-cols-2">
        <Row label="Audience" value={sponsor.audience} />
        <Row label="Regions" value={sponsor.regions.join(" · ")} />
        <Row label="Games" value={sponsor.games.join(", ")} full />
      </dl>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        {previewMode ? (
          <GatedAction label="Save" icon={<Bookmark className="h-3.5 w-3.5" />} />
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
            title="Save to pipeline (coming soon)"
            onClick={() =>
              alert("Pipeline save is coming soon. Your account is ready.")
            }
          >
            <Bookmark className="h-3.5 w-3.5" />
            Save
          </button>
        )}

        <div className="flex items-center gap-2">
          {previewMode ? (
            <>
              <GatedAction
                label="AI pitch"
                icon={<Sparkles className="h-3.5 w-3.5 text-violet-300" />}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-200"
              />
              <GatedAction
                label="Apply"
                icon={<Lock className="h-3 w-3" />}
                className="rounded-full bg-violet-400/80 px-3 py-1.5 text-xs font-medium text-zinc-950"
                primary
              />
            </>
          ) : (
            <>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-200 hover:border-violet-400/40 hover:text-white"
                title="AI pitch drafting (coming soon)"
                onClick={() =>
                  alert("AI pitch drafting is coming in the next update.")
                }
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                AI pitch
              </button>
              <a
                href={sponsor.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-400 px-3 py-1.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-violet-300"
              >
                Apply
                <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
        </div>
      </div>

      {sponsor.contact && (
        <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-zinc-500">
          <Mail className="h-3 w-3" /> {sponsor.contact}
        </p>
      )}

      <SponsorAiAdvisor sponsor={sponsorToListing(sponsor)} />
    </motion.article>
  );
}

function GatedAction({
  label,
  icon,
  className,
  primary,
}: {
  label: string;
  icon: React.ReactNode;
  className?: string;
  primary?: boolean;
}) {
  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white",
          className,
        )}
        title={`Sign in to ${label.toLowerCase()}`}
      >
        {icon}
        {label}
        {primary && null}
      </button>
    </SignInButton>
  );
}

function Row({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-zinc-200">{value}</dd>
    </div>
  );
}

function BrandMark({ hue, name }: { hue: number; name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-zinc-950"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 85% 65%), hsl(${(hue + 40) % 360} 85% 55%))`,
      }}
    >
      {initials || <Building2 className="h-5 w-5" />}
    </div>
  );
}
