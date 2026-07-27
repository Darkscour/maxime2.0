import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import { fetchPendingJoinRequestTeamIds } from "@/lib/team-join-request-db";
import { listPublicTeams } from "@/lib/teams-directory";
import { TeamsDirectory } from "@/components/dashboard/teams-directory";
import { DashboardJoinTeamPanel } from "@/components/dashboard/dashboard-join-team-panel";
import { DeskPageHeader, DeskPanel } from "@/components/dashboard/desk-ui";
import { parseTier } from "@/lib/audience-guards";

export const dynamic = "force-dynamic";

export default async function DashboardTeamsPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType === "team_manager") {
    redirect("/dashboard");
  }
  const playerTier = parseTier(ctx.playerProfile?.accountTier ?? ctx.accountTier);
  if (!playerTier) {
    redirect("/dashboard/settings/profile");
  }

  const teams = await listPublicTeams(playerTier);
  const pendingRequestTeamIds = ctx.playerProfile
    ? await fetchPendingJoinRequestTeamIds(ctx.playerProfile.id)
    : [];
  const pendingInviteTeamIds = ctx.playerProfile
    ? (
        await fetchPendingInvitesForPlayer(ctx.playerProfile.id, {
          accountTier: ctx.playerProfile.accountTier ?? ctx.accountTier,
          institutionId: ctx.playerProfile.institutionId,
        })
      ).map((invite) => invite.teamId)
    : [];

  return (
    <div className="space-y-6">
      <DeskPageHeader
        title="Teams"
        job={
          playerTier === "collegiate"
            ? "Explore collegiate orgs and join with an invite code from their captain."
            : "Explore grassroots orgs and join with an invite code from their captain."
        }
      />

      <section>
        <p className="md-subpage-kicker mb-4">
          {teams.length} team{teams.length === 1 ? "" : "s"} on Maxime
        </p>
        <TeamsDirectory
          teams={teams}
          playerOnTeam={!!ctx.team}
          pendingRequestTeamIds={pendingRequestTeamIds}
          pendingInviteTeamIds={pendingInviteTeamIds}
        />
      </section>

      <DeskPanel>
        <h2 className="font-heading text-lg font-semibold tracking-[-0.01em] text-[var(--md-text)]">
          Join with an invite code
        </h2>
        <p className="mt-1 text-sm text-[var(--md-text-muted)]">
          Found a team you like? Paste their code and join the roster.
        </p>
        <div className="mt-5">
          <DashboardJoinTeamPanel
            hasTeam={!!ctx.team}
            teamName={ctx.team?.name}
            membershipRole={ctx.membershipRole}
          />
        </div>
      </DeskPanel>
    </div>
  );
}
