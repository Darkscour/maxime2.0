import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import {
  getScoutPlayerProfile,
  recordPlayerProfileView,
} from "@/lib/player-analytics";
import {
  hasPendingRecruitmentInvite,
  isOnWatchlist,
  isPlayerOnTeam,
} from "@/lib/player-watchlist-db";
import { hasPendingJoinRequest } from "@/lib/team-join-request-db";
import { ScoutWatchlistButton } from "@/components/dashboard/scout-watchlist-button";
import { ScoutJoinRequestActions } from "@/components/dashboard/scout-join-request-actions";
import { Badge } from "@/components/ui/badge";
import { canEditTeam } from "@/lib/permissions";
import { fetchTeamRoster } from "@/lib/team-roster";
import {
  buildTeamRecruitmentContext,
  scorePlayerRecruitmentFit,
} from "@/lib/player-recruitment-fit";
import { PlayerScoutFitPanel } from "@/components/dashboard/player-scout-fit-panel";
import {
  canManagerRecruitPlayer,
  parseTier,
} from "@/lib/audience-guards";

export const dynamic = "force-dynamic";

function formatTierLabel(tier: string | null | undefined): string | null {
  if (!tier) return null;
  const t = tier.trim().toLowerCase();
  if (t === "collegiate") return "Collegiate";
  if (t === "grassroots") return "Grassroots";
  return tier;
}

function formatJoined(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative overflow-hidden rounded-[var(--md-radius)] border border-[var(--md-card-border)] bg-[var(--md-card)] px-3.5 py-3 shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_5%,transparent)]">
      <span
        aria-hidden
        className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[var(--md-accent)] opacity-80"
      />
      <dt className="pl-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--md-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 truncate pl-2 text-sm font-semibold tracking-[-0.01em] text-[var(--md-text)]">
        {value}
      </dd>
    </div>
  );
}

function statusTone(status: string): "green" | "amber" | "zinc" {
  const s = status.trim().toLowerCase();
  if (s.includes("available") || s.includes("looking")) return "green";
  if (s.includes("open") || s.includes("considering")) return "amber";
  return "zinc";
}

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
  const [onRoster, onWatchlist, joinRequestPending, invitePending, roster] =
    teamId
      ? await Promise.all([
          isPlayerOnTeam(teamId, profile.id),
          isOnWatchlist(teamId, profile.id),
          hasPendingJoinRequest(teamId, profile.id),
          hasPendingRecruitmentInvite(teamId, profile.id),
          fetchTeamRoster(teamId),
        ])
      : [false, false, false, false, []];

  await recordPlayerProfileView({
    playerProfileId: profile.id,
    viewerUserId: ctx.userId,
    viewerTeamId: teamId ?? null,
    playerOwnerUserId: profile.userId,
  });

  const canManage = !!ctx.team && canEditTeam(ctx.membershipRole);
  const showWatchlist = !onRoster && onWatchlist;

  const recruitmentFit = scorePlayerRecruitmentFit(
    buildTeamRecruitmentContext(
      {
        games: ctx.team.games ?? [],
        region: ctx.team.region ?? null,
        school: ctx.team.school ?? null,
        rosterSize: ctx.team.rosterSize ?? null,
      },
      roster,
    ),
    {
      game: profile.game,
      role: profile.role,
      rank: profile.rank,
      region: profile.region,
      school: profile.school,
      status: profile.status,
      tags: profile.tags,
      hoursPerWeek: profile.hoursPerWeek,
    },
  );

  const initial = profile.handle.trim().charAt(0).toUpperCase() || "?";
  const tierLabel = formatTierLabel(profile.accountTier);
  const facts = [
    { label: "Game", value: profile.game },
    { label: "Role", value: profile.role },
    { label: "Rank", value: profile.rank },
    { label: "Region", value: profile.region },
    profile.school ? { label: "School", value: profile.school } : null,
    profile.age != null ? { label: "Age", value: String(profile.age) } : null,
    profile.hoursPerWeek != null
      ? { label: "Practice", value: `${profile.hoursPerWeek} hrs / wk` }
      : null,
    tierLabel ? { label: "Circuit", value: tierLabel } : null,
    { label: "On Overcast", value: formatJoined(profile.createdAt) },
  ].filter((f): f is { label: string; value: string } => f != null);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/scout"
        className="text-sm font-medium text-[var(--md-text-muted)] transition-colors hover:text-[var(--md-accent)]"
      >
        ← Scout
      </Link>

      <article className="md-subpage-panel overflow-hidden">
        <div className="border-b border-[var(--md-card-border)] px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-start gap-4">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-inset ring-[var(--md-card-border)]"
              />
            ) : (
              <span
                className="font-heading flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--md-primary)] text-xl font-bold text-white"
                aria-hidden
              >
                {initial}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-[var(--md-text)] sm:text-3xl">
                  {profile.handle}
                </h1>
                <Badge tone={statusTone(profile.status)}>{profile.status}</Badge>
              </div>
              {profile.displayName &&
                profile.displayName.trim().toLowerCase() !==
                  profile.handle.trim().toLowerCase() && (
                  <p className="mt-1 text-sm text-[var(--md-text-muted)]">
                    {profile.displayName}
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <dl className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(9.75rem,1fr))]">
            {facts.map((fact) => (
              <Fact key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </dl>

          {profile.bio?.trim() ? (
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--md-text-muted)]">
                Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--md-text)]">
                {profile.bio.trim()}
              </p>
            </section>
          ) : null}

          {profile.tags.length > 0 ? (
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--md-text-muted)]">
                Tags
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.tags.map((tag) => (
                  <Badge key={tag} tone="violet">
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}

          <PlayerScoutFitPanel fit={recruitmentFit} />

          <div className="border-t border-[var(--md-card-border)] pt-6">
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
        </div>
      </article>
    </div>
  );
}
