import { getDashboardContext } from "@/lib/auth-user";
import { fetchSponsorsForDisplay } from "@/lib/fetch-sponsors";
import { getTeamSponsorLeads, type SponsorLeadRecord } from "@/lib/sponsor-pipeline";
import { LiveSponsorshipDirectory } from "@/components/sponsorships/live-sponsorship-directory";

export const dynamic = "force-dynamic";

export default async function DashboardSponsorshipsPage() {
  const ctx = await getDashboardContext();
  const result = await fetchSponsorsForDisplay();
  const liveSponsors =
    result.source === "database" ? result.sponsors : [];

  let leadsBySponsorId: Record<string, SponsorLeadRecord> = {};

  if (ctx.team) {
    const leads = await getTeamSponsorLeads(ctx.team.id);
    leadsBySponsorId = Object.fromEntries(leads.map((l) => [l.sponsorId, l]));
  }

  return (
    <LiveSponsorshipDirectory
      liveSponsors={liveSponsors}
      dataSource={result.source}
      fetchError={result.error}
      hasTeam={!!ctx.team}
      leadsBySponsorId={leadsBySponsorId}
      embedded
    />
  );
}
