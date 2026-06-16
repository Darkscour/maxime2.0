import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchSponsorsForDisplay } from "@/lib/fetch-sponsors";
import { getTeamSponsorLeads } from "@/lib/sponsor-pipeline";
import { LiveSponsorshipDirectory } from "@/components/sponsorships/live-sponsorship-directory";

export const dynamic = "force-dynamic";

export default async function DashboardSponsorshipsPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager" || ctx.accountTier !== "collegiate") {
    redirect("/dashboard");
  }

  const [result, leads] = await Promise.all([
    fetchSponsorsForDisplay(),
    ctx.team ? getTeamSponsorLeads(ctx.team.id) : Promise.resolve([]),
  ]);

  const liveSponsors = result.source === "database" ? result.sponsors : [];
  const leadsBySponsorId = Object.fromEntries(leads.map((l) => [l.sponsorId, l]));

  return (
    <LiveSponsorshipDirectory
      liveSponsors={liveSponsors}
      dataSource={result.source}
      fetchError={result.error}
      embedded
      leadsBySponsorId={leadsBySponsorId}
      showPipeline={!!ctx.team}
    />
  );
}
