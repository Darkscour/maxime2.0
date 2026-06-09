import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchSponsorsForDisplay } from "@/lib/fetch-sponsors";
import { LiveSponsorshipDirectory } from "@/components/sponsorships/live-sponsorship-directory";

export const dynamic = "force-dynamic";

export default async function DashboardSponsorshipsPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }

  const result = await fetchSponsorsForDisplay();
  const liveSponsors =
    result.source === "database" ? result.sponsors : [];

  return (
    <LiveSponsorshipDirectory
      liveSponsors={liveSponsors}
      dataSource={result.source}
      fetchError={result.error}
      embedded
    />
  );
}
