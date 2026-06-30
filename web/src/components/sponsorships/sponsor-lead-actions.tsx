"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, ExternalLink } from "lucide-react";
import type { SponsorListing } from "@/lib/sponsor-listing";
import {
  SPONSOR_LEAD_STATUSES,
  SPONSOR_LEAD_STATUS_LABELS,
  type SponsorLeadStatus,
} from "@/lib/sponsor-fit";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/safe-json";
import { cn } from "@/lib/utils";

function statusTone(status: SponsorLeadStatus) {
  if (status === "deal") return "green" as const;
  if (status === "replied") return "cyan" as const;
  if (status === "applied") return "violet" as const;
  if (status === "passed") return "zinc" as const;
  return "amber" as const;
}

export function SponsorLeadActions({
  sponsor,
  lead,
  compact = false,
}: {
  sponsor: SponsorListing;
  lead?: SponsorLeadRecord | null;
  compact?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localLead, setLocalLead] = useState(lead ?? null);

  async function saveToPipeline() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/sponsorship/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorId: sponsor.id,
          sponsorName: sponsor.name,
          industry: sponsor.industry,
          difficulty: sponsor.difficulty,
          sponsorLink: sponsor.sponsorLink,
        }),
      });
      const data = await parseJsonResponse<{ error?: string; lead?: SponsorLeadRecord }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not save.");
        return;
      }
      if (data?.lead) setLocalLead(data.lead);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: SponsorLeadStatus) {
    if (!localLead) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/sponsorship/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: localLead.id, status }),
      });
      const data = await parseJsonResponse<{ error?: string; lead?: SponsorLeadRecord }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not update.");
        return;
      }
      if (data?.lead) setLocalLead(data.lead);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "border-t border-white/5 pt-4",
        compact ? "mt-3" : "mt-5",
      )}
    >
      {error && (
        <p className="mb-2 text-xs text-red-300">{error}</p>
      )}

      {!localLead ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={saveToPipeline}
          className="gap-1.5"
        >
          <Bookmark className="h-3.5 w-3.5" />
          {loading ? "Saving…" : "Save to pipeline"}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone(localLead.status as SponsorLeadStatus)}>
              {SPONSOR_LEAD_STATUS_LABELS[localLead.status as SponsorLeadStatus]}
            </Badge>
            <select
              value={localLead.status}
              disabled={loading}
              onChange={(e) => updateStatus(e.target.value as SponsorLeadStatus)}
              className="rounded-lg border border-white/10 bg-[var(--background)] px-2 py-1 text-xs text-zinc-200 focus:border-violet-400/50 focus:outline-none"
            >
              {SPONSOR_LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {SPONSOR_LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          {sponsor.sponsorLink !== "#" && (
            <a
              href={sponsor.sponsorLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (localLead.status === "saved") {
                  void updateStatus("applied");
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-400 px-3 py-1.5 text-xs font-medium text-zinc-950 hover:bg-violet-300"
            >
              Open application
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
