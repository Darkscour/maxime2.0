"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import type { SponsorListing } from "@/lib/sponsor-listing";

function buildAdvice(sponsor: SponsorListing): string {
  const difficulty = sponsor.difficulty.toLowerCase();
  const tierNote =
    difficulty.includes("starter") || difficulty.includes("easy")
      ? "This looks approachable for a smaller collegiate roster — product or small cash deals are common."
      : difficulty.includes("growth") || difficulty.includes("medium")
        ? "A mid-size org with some social reach and a clear pitch deck has a fair shot here."
        : "Treat this as a stretch goal unless your org has strong reach, results, and a polished media kit.";

  return [
    `${sponsor.name} (${sponsor.industry}) typically expects you to show audience size, content cadence, and what you deliver in return (logo placement, streams, LAN booths, etc.).`,
    tierNote,
    "Team-size tailored advice (roster count, avg viewers, school tier) is coming soon — for now, assume a 5–12 player collegiate club preparing a one-page outreach brief.",
    sponsor.sponsorLink !== "#"
      ? `Review their application page before you apply: ${sponsor.sponsorLink}`
      : "Confirm the official application link on their site before reaching out.",
  ].join("\n\n");
}

export function SponsorAiAdvisor({ sponsor }: { sponsor: SponsorListing }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-left text-xs font-medium text-cyan-200 transition-colors hover:bg-cyan-400/10"
      >
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI: should we apply?
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="mt-3 whitespace-pre-line text-xs leading-5 text-zinc-400">
          {buildAdvice(sponsor)}
        </p>
      )}
    </div>
  );
}
