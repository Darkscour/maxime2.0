import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import { TeamInvitesPanel } from "@/components/dashboard/team-invites-panel";
import { DeskPageHeader } from "@/components/dashboard/desk-ui";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function TeamInvitesPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType === "team_manager") {
    redirect("/dashboard");
  }

  if (!ctx.playerProfile) {
    redirect("/onboarding");
  }

  const invites = await fetchPendingInvitesForPlayer(ctx.playerProfile.id, {
    accountTier: ctx.playerProfile.accountTier ?? ctx.accountTier,
    institutionId: ctx.playerProfile.institutionId,
  });

  const isGrassroots = ctx.accountTier === "grassroots";

  return (
    <div className="space-y-6">
      <DeskPageHeader
        title="Invites"
        job={
          isGrassroots
            ? "Accept or decline recruitment invites from teams."
            : "Accept or decline recruitment invites from collegiate teams at your school."
        }
        action={
          <Button href="/dashboard/teams" size="sm" variant="outline">
            Browse teams
          </Button>
        }
      />

      <TeamInvitesPanel
        invites={invites}
        onTeam={!!ctx.team}
        currentTeamName={ctx.team?.name}
      />
    </div>
  );
}
