import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { listScoutablePlayers } from "@/lib/player-analytics";
import { filterPlayersForScout } from "@/lib/player-scout-visibility";
import { fetchTeamScoutCardContext } from "@/lib/player-watchlist-db";
import { fetchPendingJoinRequestPlayerIdsForTeam } from "@/lib/team-join-request-db";
import { ScoutPlayerGridCard } from "@/components/dashboard/scout-player-grid-card";
import { DeskEmpty, DeskPageHeader } from "@/components/dashboard/desk-ui";
import { Button } from "@/components/ui/button";
import { canEditTeam } from "@/lib/permissions";
import { parseTier, managerPoolContext } from "@/lib/audience-guards";

export const dynamic = "force-dynamic";

export default async function DashboardScoutPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }
  const teamTier = parseTier(ctx.team?.accountTier ?? ctx.accountTier);
  if (!teamTier || !ctx.team) {
    redirect("/dashboard/settings/team");
  }

  const canManage = !!ctx.team && canEditTeam(ctx.membershipRole);
  const teamId = ctx.team?.id;

  const managerPool = managerPoolContext({
    accountTier: teamTier,
    institutionId: ctx.team.institutionId ?? null,
  });

  const [players, scoutContext, joinRequestPlayerIds] = await Promise.all([
    listScoutablePlayers({
      managerTeamTier: teamTier,
      managerInstitutionId: ctx.team?.institutionId ?? null,
    }),
    teamId ? fetchTeamScoutCardContext(teamId) : Promise.resolve(null),
    teamId
      ? fetchPendingJoinRequestPlayerIdsForTeam(teamId, managerPool)
      : Promise.resolve([]),
  ]);

  const joinRequestIds = new Set(joinRequestPlayerIds);
  const watchlistIds = new Set(scoutContext?.watchlistPlayerIds ?? []);
  const pendingInviteIds = new Set(scoutContext?.pendingInvitePlayerIds ?? []);
  const rosterIds = new Set(scoutContext?.rosterPlayerProfileIds ?? []);
  const visiblePlayers = filterPlayersForScout(players, rosterIds);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <DeskPageHeader
        title="Scout"
        job={
          teamTier === "collegiate"
            ? "Browse collegiate players at your school. Save candidates or send an invite."
            : "Browse grassroots players. Save candidates or send an invite."
        }
        action={
          <Button href="/dashboard/watchlist" size="sm" variant="outline">
            Open watchlist
          </Button>
        }
      />

      {visiblePlayers.length === 0 ? (
        <DeskEmpty
          title="No players to scout yet"
          body={
            teamTier === "collegiate"
              ? "Campus players appear here when they finish their scout cards at your school."
              : "Grassroots players appear here when they finish their scout cards."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePlayers.map((player) => (
            <ScoutPlayerGridCard
              key={player.id}
              player={player}
              teamName={ctx.team?.name ?? "your team"}
              canManage={canManage}
              onWatchlist={watchlistIds.has(player.id)}
              invitePending={pendingInviteIds.has(player.id)}
              joinRequestPending={joinRequestIds.has(player.id)}
              onRoster={rosterIds.has(player.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
