import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchTeamWatchlistWithAvatars } from "@/lib/player-watchlist-db";
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

  const items = await fetchTeamWatchlistWithAvatars(
    ctx.team.id,
    managerPoolContext({
      accountTier: ctx.team.accountTier ?? ctx.accountTier,
      institutionId: ctx.team.institutionId ?? null,
    }),
  );

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

      <WatchlistPanel items={items} teamName={ctx.team.name} />
    </div>
  );
}
