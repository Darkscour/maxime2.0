import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchTeamWatchlistWithAvatars } from "@/lib/player-watchlist-db";
import { fetchTeamRoster } from "@/lib/team-roster";
import {
  buildTeamRecruitmentContext,
  scorePlayerRecruitmentFit,
} from "@/lib/player-recruitment-fit";
import { WatchlistPanel } from "@/components/dashboard/watchlist-panel";
import { DeskPageHeader } from "@/components/dashboard/desk-ui";
import { Button } from "@/components/ui/button";
import { canEditTeam } from "@/lib/permissions";
import { managerPoolContext } from "@/lib/audience-guards";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }

  if (!ctx.team || !canEditTeam(ctx.membershipRole)) {
    redirect("/dashboard/settings/team");
  }

  const [items, roster] = await Promise.all([
    fetchTeamWatchlistWithAvatars(
      ctx.team.id,
      managerPoolContext({
        accountTier: ctx.team.accountTier ?? ctx.accountTier,
        institutionId: ctx.team.institutionId ?? null,
      }),
    ),
    fetchTeamRoster(ctx.team.id),
  ]);

  const recruitmentContext = buildTeamRecruitmentContext(
    {
      games: ctx.team.games ?? [],
      region: ctx.team.region ?? null,
      school: ctx.team.school ?? null,
      rosterSize: ctx.team.rosterSize ?? null,
    },
    roster,
  );

  const itemsWithFit = items.map((player) => ({
    ...player,
    fit: scorePlayerRecruitmentFit(recruitmentContext, {
      game: player.game,
      role: player.role,
      rank: player.rank,
      region: player.region,
      school: player.school,
      status: player.status,
      tags: player.tags,
      hoursPerWeek: player.hoursPerWeek,
    }),
  }));

  return (
    <div className="space-y-6">
      <DeskPageHeader
        title="Watchlist"
        job={
          ctx.accountTier === "collegiate"
            ? `Shortlisted campus players for ${ctx.team.name}. Invite when you're ready.`
            : `Shortlisted players for ${ctx.team.name}. Invite when you're ready.`
        }
        action={
          <Button href="/dashboard/scout" size="sm" variant="outline">
            Scout players
          </Button>
        }
      />

      <WatchlistPanel items={itemsWithFit} teamName={ctx.team.name} />
    </div>
  );
}
