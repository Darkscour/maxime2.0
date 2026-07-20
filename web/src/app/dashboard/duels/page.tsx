import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { canEditTeam } from "@/lib/permissions";
import { DuelsPanel } from "@/components/dashboard/duels-panel";
import { DeskPageHeader } from "@/components/dashboard/desk-ui";
import { listPublicTeams } from "@/lib/teams-directory";
import { listDuelsForTeam } from "@/lib/duels";
import type { PublicTeamListing } from "@/lib/teams-directory";

export const dynamic = "force-dynamic";

export default async function DuelsPage() {
  const ctx = await getDashboardContext();
  if (ctx.accountType !== "team_manager" || ctx.accountTier !== "grassroots") {
    redirect("/dashboard");
  }
  if (!ctx.team || !canEditTeam(ctx.membershipRole)) {
    redirect("/dashboard/settings/team");
  }

  const [duels, teams] = await Promise.all([
    listDuelsForTeam(ctx.team.id),
    listPublicTeams("grassroots"),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <DeskPageHeader
        title="Duels"
        job="Challenge other grassroots teams and track incoming, open, and past challenges."
      />

      <DuelsPanel
        teamId={ctx.team.id}
        teams={teams
          .filter((team: PublicTeamListing) => team.id !== ctx.team!.id)
          .map((team: PublicTeamListing) => ({ id: team.id, name: team.name }))}
        initialDuels={duels}
      />
    </div>
  );
}
