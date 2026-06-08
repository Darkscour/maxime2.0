import type { SponsorListing } from "@/lib/sponsor-listing";

export type TeamFitProfile = {
  games: string[];
  region: string | null;
  rosterSize: number | null;
  avgViewers: number | null;
  school: string | null;
};

export type SponsorFitResult = {
  score: number;
  reason: string;
};

export const SPONSOR_LEAD_STATUSES = [
  "saved",
  "applied",
  "replied",
  "passed",
  "deal",
] as const;

export type SponsorLeadStatus = (typeof SPONSOR_LEAD_STATUSES)[number];

export const SPONSOR_LEAD_STATUS_LABELS: Record<SponsorLeadStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  replied: "Replied",
  passed: "Passed",
  deal: "Deal",
};

export function isSponsorLeadStatus(value: string): value is SponsorLeadStatus {
  return SPONSOR_LEAD_STATUSES.includes(value as SponsorLeadStatus);
}

/** Rule-based fit for collegiate orgs using onboarding team fields. */
export function scoreSponsorFit(
  team: TeamFitProfile,
  sponsor: Pick<SponsorListing, "difficulty" | "industry">,
): SponsorFitResult {
  let score = 45;
  const reasons: string[] = [];
  const tier = sponsor.difficulty.toLowerCase();

  if (tier.includes("starter") || tier.includes("easy")) {
    score += 25;
    reasons.push("Starter-friendly for collegiate orgs");
  } else if (tier.includes("growth") || tier.includes("medium")) {
    score += 15;
    reasons.push("Growth tier — good mid-size target");
  } else if (tier.includes("established") || tier.includes("hard")) {
    score += 5;
    reasons.push("Established brand — competitive outreach");
  }

  const viewers = team.avgViewers ?? 0;
  if (viewers > 0 && viewers < 50 && tier.includes("starter")) {
    score += 10;
    reasons.push("Fits your current stream reach");
  }
  if (viewers >= 50 && (tier.includes("growth") || tier.includes("established"))) {
    score += 10;
    reasons.push("Your viewer base supports larger asks");
  }

  if (team.games.length > 0) {
    score += 8;
    reasons.push(
      team.games.length > 1
        ? "Multi-title org — broader partnership angles"
        : "Clear competitive focus for pitching",
    );
  }

  if (team.region) {
    score += 5;
    reasons.push(`${team.region} org profile`);
  }

  if (team.school) {
    score += 5;
    reasons.push("Collegiate identity for local/regional brands");
  }

  const industry = sponsor.industry.toLowerCase();
  if (
    industry.includes("peripheral") ||
    industry.includes("hardware") ||
    industry.includes("energy")
  ) {
    score += 5;
    reasons.push("Category popular with grassroots teams");
  }

  return {
    score: Math.min(100, score),
    reason: reasons.slice(0, 3).join(" · ") || "General sponsor directory match",
  };
}

export function rankSponsorsByFit(
  team: TeamFitProfile,
  sponsors: SponsorListing[],
): (SponsorListing & SponsorFitResult)[] {
  return sponsors
    .map((s) => ({ ...s, ...scoreSponsorFit(team, s) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
