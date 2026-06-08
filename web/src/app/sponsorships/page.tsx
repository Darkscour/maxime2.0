/**
 * Sponsorship portal page — Server Component.
 *
 * Visitors see a preview experience (demo + gated actions).
 * Signed-in users see only live Supabase sponsor rows + team pipeline actions.
 */

import { auth } from "@clerk/nextjs/server";
import { DEMO_SPONSOR_LISTINGS, listingToPortalSponsor } from "@/lib/sponsor-listing";
import { fetchSponsorsForDisplay } from "@/lib/fetch-sponsors";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import { getTeamSponsorLeads, teamToFitProfile } from "@/lib/sponsor-pipeline";
import type { TeamFitProfile } from "@/lib/sponsor-fit";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";
import { SponsorshipsPortal } from "./sponsorships-portal";

export const dynamic = "force-dynamic";

export default async function SponsorshipsPage() {
  const result = await fetchSponsorsForDisplay();
  const liveSponsors =
    result.source === "database" ? result.sponsors : [];
  const previewSponsors = DEMO_SPONSOR_LISTINGS.map(listingToPortalSponsor);

  const { userId } = await auth();
  let teamFit: TeamFitProfile | null = null;
  let leadsBySponsorId: Record<string, SponsorLeadRecord> = {};

  if (userId) {
    const account = await getOrCreateUserAccount();
    if (account.membership?.team) {
      teamFit = teamToFitProfile(account.membership.team);
      const leads = await getTeamSponsorLeads(account.membership.team.id);
      leadsBySponsorId = Object.fromEntries(leads.map((l) => [l.sponsorId, l]));
    }
  }

  return (
    <SponsorshipsPortal
      previewSponsors={previewSponsors}
      liveSponsors={liveSponsors}
      dataSource={result.source}
      fetchError={result.error}
      teamFit={teamFit}
      leadsBySponsorId={leadsBySponsorId}
    />
  );
}
