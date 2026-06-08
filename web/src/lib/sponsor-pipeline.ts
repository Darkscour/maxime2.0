import { findLeadsByTeamId } from "@/lib/sponsor-lead-store";
import type { SponsorLeadStatus } from "@/lib/sponsor-fit";
import type { TeamFitProfile } from "@/lib/sponsor-fit";

export type SponsorLeadRecord = {
  id: string;
  sponsorId: string;
  sponsorName: string;
  industry: string | null;
  difficulty: string | null;
  sponsorLink: string | null;
  status: SponsorLeadStatus;
  fitScore: number | null;
  fitReason: string | null;
  notes: string | null;
  appliedAt: Date | null;
  updatedAt: Date;
};

export async function getTeamSponsorLeads(teamId: string): Promise<SponsorLeadRecord[]> {
  return findLeadsByTeamId(teamId);
}

export function teamToFitProfile(team: {
  id: string;
  games: string[];
  region: string | null;
  rosterSize: number | null;
  avgViewers: number | null;
  school: string | null;
}): TeamFitProfile & { id: string } {
  return {
    id: team.id,
    games: team.games,
    region: team.region,
    rosterSize: team.rosterSize,
    avgViewers: team.avgViewers,
    school: team.school,
  };
}
