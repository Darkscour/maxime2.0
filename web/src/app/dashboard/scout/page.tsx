import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { listScoutablePlayers } from "@/lib/player-analytics";
import { filterPlayersForScout } from "@/lib/player-scout-visibility";
import { fetchTeamScoutCardContext } from "@/lib/player-watchlist-db";
import { fetchPendingJoinRequestPlayerIdsForTeam } from "@/lib/team-join-request-db";
import { ScoutPlayerGridCard } from "@/components/dashboard/scout-player-grid-card";
import { canEditTeam } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function DashboardScoutPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }

  const canManage = !!ctx.team && canEditTeam(ctx.membershipRole);
  const teamId = ctx.team?.id;

  const [players, scoutContext, joinRequestPlayerIds] = await Promise.all([
    listScoutablePlayers(),
    teamId ? fetchTeamScoutCardContext(teamId) : Promise.resolve(null),
    teamId
      ? fetchPendingJoinRequestPlayerIdsForTeam(teamId)
      : Promise.resolve([]),
  ]);

  const joinRequestIds = new Set(joinRequestPlayerIds);

  const watchlistIds = new Set(scoutContext?.watchlistPlayerIds ?? []);
  const pendingInviteIds = new Set(scoutContext?.pendingInvitePlayerIds ?? []);
  const rosterIds = new Set(scoutContext?.rosterPlayerProfileIds ?? []);
  const visiblePlayers = filterPlayersForScout(players, rosterIds);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Scout
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-white">
          Player profiles
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
          Browse registered players on Maxime. Players already on your roster are hidden
          here — manage them in Roster hub. Save candidates to your watchlist or send an
          invite directly; players who requested to join show a badge on their card.
        </p>
      </header>

      {visiblePlayers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--surface)]/50 p-10 text-center">
          <Search className="mx-auto h-8 w-8 text-zinc-600" />
          <p className="mt-4 text-sm text-zinc-400">
            No player profiles yet. They&apos;ll appear here as players complete
            onboarding.
          </p>
        </div>
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
