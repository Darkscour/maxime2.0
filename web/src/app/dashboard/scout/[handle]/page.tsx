import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import {
  getScoutPlayerProfile,
  recordPlayerProfileView,
} from "@/lib/player-analytics";
import { hasPendingRecruitmentInvite, isOnWatchlist, isPlayerOnTeam } from "@/lib/player-watchlist-db";
import { hasPendingJoinRequest } from "@/lib/team-join-request-db";
import { ScoutWatchlistButton } from "@/components/dashboard/scout-watchlist-button";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";
import { ScoutJoinRequestActions } from "@/components/dashboard/scout-join-request-actions";
import { Badge } from "@/components/ui/badge";
import { canEditTeam } from "@/lib/permissions";
import { canManagerRecruitPlayer, parseTier } from "@/lib/audience-guards";

export const dynamic = "force-dynamic";

export default async function ScoutPlayerProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const [ctx, profile] = await Promise.all([
    getDashboardContext(),
    getScoutPlayerProfile(handle),
  ]);

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }
  const managerTier = parseTier(ctx.team?.accountTier ?? ctx.accountTier);
  if (!managerTier || !ctx.team) {
    redirect("/dashboard/settings/team");
  }

  if (!profile) notFound();
  if (
    !canManagerRecruitPlayer(
      {
        accountTier: managerTier,
        institutionId: ctx.team.institutionId ?? null,
      },
      {
        accountTier: profile.accountTier,
        institutionId: profile.institutionId,
      },
    )
  ) {
    redirect("/dashboard/scout");
  }

  const teamId = ctx.team?.id;
  const [onRoster, onWatchlist, joinRequestPending, invitePending] = teamId
    ? await Promise.all([
        isPlayerOnTeam(teamId, profile.id),
        isOnWatchlist(teamId, profile.id),
        hasPendingJoinRequest(teamId, profile.id),
        hasPendingRecruitmentInvite(teamId, profile.id),
      ])
    : [false, false, false, false];

  await recordPlayerProfileView({
    playerProfileId: profile.id,
    viewerUserId: ctx.userId,
    viewerTeamId: teamId ?? null,
    playerOwnerUserId: profile.userId,
  });

  const canManage = !!ctx.team && canEditTeam(ctx.membershipRole);
  const showWatchlist = !onRoster && onWatchlist;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/dashboard/scout"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Scout
      </Link>

      <DashboardSectionEyebrow accent="violet" className="mt-4">
        Recruitment
      </DashboardSectionEyebrow>

      <article className="rounded-2xl border border-white/5 bg-[var(--surface)] p-8">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Player profile</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-white">
          {profile.handle}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {profile.game} · {profile.role} · {profile.rank}
        </p>

        <dl className="mt-6 space-y-3 text-sm text-zinc-400">
          {profile.region && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-violet-400" />
              <span>{profile.region}</span>
            </div>
          )}
          {profile.hoursPerWeek != null && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>{profile.hoursPerWeek} hrs/week on {profile.game}</span>
            </div>
          )}
          {profile.school && <div>School: {profile.school}</div>}
          <div>Status: {profile.status}</div>
        </dl>

        {profile.bio && (
          <p className="mt-6 text-sm leading-7 text-zinc-400">{profile.bio}</p>
        )}

        {profile.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {profile.tags.map((tag) => (
              <Badge key={tag} tone="violet">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-8 border-t border-white/5 pt-6">
          {onRoster ? (
            <p className="text-sm text-emerald-400">Already on your roster</p>
          ) : canManage && (joinRequestPending || invitePending) ? (
            <ScoutJoinRequestActions
              playerProfileId={profile.id}
              playerHandle={profile.handle}
              teamName={ctx.team!.name}
              joinRequestPending={joinRequestPending}
              invitePending={invitePending}
            />
          ) : (
            <ScoutWatchlistButton
              playerProfileId={profile.id}
              initialOnWatchlist={showWatchlist}
              canManage={canManage}
            />
          )}
        </div>
      </article>
    </div>
  );
}
