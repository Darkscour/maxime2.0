import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Pencil } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { isDeveloperEmail } from "@/lib/developer";
import { DeveloperMarketingPreview } from "@/components/dashboard/developer-marketing-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DashboardStatCard,
  FeatureTile,
} from "@/components/dashboard/dashboard-cards";
import { DashboardAnalyticsCard } from "@/components/dashboard/dashboard-analytics-card";
import { getPlayerAnalytics } from "@/lib/player-analytics";
import { getManagerOrgAnalytics } from "@/lib/manager-analytics";
import { AuthNoticeBanner } from "@/components/auth/auth-notice-banner";
import {
  Bookmark,
  Building2,
  Handshake,
  Mail,
  Search,
  Settings,
  Swords,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import { LeaveTeamCard } from "@/components/dashboard/leave-team-card";
import { RosterHubPreview } from "@/components/dashboard/roster-hub-preview";
import { fetchTeamRosterWithAvatars } from "@/lib/team-roster";
import { canEditTeam } from "@/lib/permissions";
import { formatMembershipRole } from "@/lib/dashboard-nav";
import { isVerifiedManager } from "@/lib/manager-verification";
import { ManagerTeamSnapshotCard } from "@/components/dashboard/manager-team-snapshot-card";
import { WorkspaceInviteCode } from "@/components/dashboard/workspace-invite-code";
import { PlayTimeWidget } from "@/components/dashboard/play-time-widget";
import { TeamInvitesWidget } from "@/components/dashboard/team-invites-widget";
import { DashboardWelcomeMarker } from "@/components/dashboard/dashboard-welcome-marker";

export const dynamic = "force-dynamic";

function formatOnMaximeSince(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type TeamMeta = NonNullable<Awaited<ReturnType<typeof getDashboardContext>>["team"]>;

function managerTeamStatHint(team: TeamMeta) {
  const parts = [
    team.school,
    team.region,
    `On Maxime since ${formatOnMaximeSince(team.createdAt)}`,
  ].filter(Boolean);
  return parts.join(" · ");
}

function playerTeamStatHint(team: TeamMeta) {
  const parts = [
    team.school,
    `On Maxime since ${formatOnMaximeSince(team.createdAt)}`,
  ].filter(Boolean);
  return parts.join(" · ");
}

function managerAccountHint(
  managerVerificationStatus: string | null | undefined,
  hasTeam: boolean,
  accountTier?: string | null,
) {
  if (!hasTeam) return "Complete team setup";
  if (accountTier === "grassroots") {
    return isVerifiedManager(managerVerificationStatus)
      ? "Grassroots manager"
      : "Email verification pending";
  }
  return isVerifiedManager(managerVerificationStatus)
    ? "Verified manager"
    : "Verification pending";
}

function rosterStatValue(team: TeamMeta) {
  return String(team.memberCount);
}

function rosterStatHint(pendingInvites: number) {
  if (pendingInvites === 1) return "1 invite pending";
  if (pendingInvites > 1) return `${pendingInvites} invites pending`;
  return "View roster hub";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await getDashboardContext();
  const isFirstDashboardVisit = !ctx.hasWelcomedToDashboard;

  const isManager = ctx.accountType === "team_manager";
  const isGrassroots = ctx.accountTier === "grassroots";
  const welcomeName = isManager
    ? (ctx.displayName?.split(" ")[0] ?? "there")
    : (ctx.playerProfile?.handle ?? "there");
  const hasProfile = !!ctx.playerProfile;
  const showDevPreview = isDeveloperEmail(ctx.email);

  const [playerAnalytics, managerAnalytics, pendingInvites, rosterMembers] =
    await Promise.all([
      !isManager && ctx.playerProfile
        ? getPlayerAnalytics(
            ctx.playerProfile.id,
            ctx.playerProfile.hoursPerWeek,
          )
        : Promise.resolve(null),
      isManager && ctx.team
        ? getManagerOrgAnalytics(ctx.team.id)
        : Promise.resolve(null),
      !isManager && ctx.playerProfile
        ? fetchPendingInvitesForPlayer(ctx.playerProfile.id, {
            accountTier: ctx.playerProfile.accountTier ?? ctx.accountTier,
            institutionId: ctx.playerProfile.institutionId,
          })
        : Promise.resolve([]),
      isManager && ctx.team
        ? fetchTeamRosterWithAvatars(ctx.team.id)
        : Promise.resolve([]),
    ]);

  const accountValue = isManager
    ? formatMembershipRole(ctx.membershipRole)
    : "Player";

  const accountHint = isManager
    ? managerAccountHint(
        ctx.managerVerificationStatus,
        !!ctx.team,
        ctx.accountTier,
      )
    : ctx.membershipRole && ctx.team
      ? `${formatMembershipRole(ctx.membershipRole)} · ${ctx.team.name}`
      : "Individual account";
  const showTeamProfileSaved = params.saved === "team-profile";

  const deskKicker = isManager
    ? isGrassroots
      ? "Grassroots program"
      : "Collegiate program"
    : isGrassroots
      ? "Grassroots player"
      : "Collegiate player";

  const welcomeLine = isFirstDashboardVisit
    ? `Welcome, ${welcomeName}`
    : `Welcome back, ${welcomeName}`;

  const deskCopy = isManager
    ? isGrassroots
      ? "Recruit, run Duels, and keep the roster moving from this board."
      : "Sponsor outreach, campus scouting, and org profile — your week starts here."
    : isGrassroots
      ? "Your player card is live. Browse grassroots teams and join a roster when you're ready."
      : "Your scout card is live. Browse teams at your school and keep your profile current.";

  const pendingJoinRequests = managerAnalytics?.pendingJoinRequests ?? 0;

  let featureIndex = 0;
  const nextIndex = () => {
    featureIndex += 1;
    return featureIndex;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <DashboardWelcomeMarker isFirstVisit={isFirstDashboardVisit} />
      <Suspense fallback={null}>
        <AuthNoticeBanner />
      </Suspense>
      {showTeamProfileSaved && (
        <div className="flex items-start gap-2 border-2 border-[color-mix(in_srgb,var(--success)_45%,var(--border))] bg-[color-mix(in_srgb,var(--success)_8%,transparent)] px-4 py-3 text-sm text-[var(--success)]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Team profile saved. Your updated picture and details are now live.
        </div>
      )}
      {showDevPreview && <DeveloperMarketingPreview />}

      {/* Program masthead */}
      <header className="pb-masthead">
        <div className="pb-masthead-rule" aria-hidden />
        <div className="min-w-0 pt-2">
          <p className="pb-kicker">{deskKicker}</p>
          <h1 className="font-board mt-3 text-[clamp(2.6rem,7vw,4.25rem)] font-semibold leading-[0.9] tracking-[0.01em] uppercase text-[var(--foreground)]">
            {welcomeLine}
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-[var(--foreground-muted)]">
            {deskCopy}
          </p>
          {ctx.email && (
            <p className="mt-3 font-mono text-[12px] tracking-[0.02em] text-[var(--foreground-subtle)]">
              {ctx.email}
            </p>
          )}
        </div>

        {isManager && ctx.team && (
          <div className="pb-id-plate">
            <p className="pb-kicker !text-[color-mix(in_srgb,#f6f7f9_55%,transparent)]">
              Org plate
            </p>
            <div className="relative flex items-start gap-3">
              <div className="relative shrink-0 border border-[color-mix(in_srgb,#f6f7f9_35%,transparent)] bg-[var(--pb-board-muted)] p-1">
                {ctx.team.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ctx.team.profileImageUrl}
                    alt={`${ctx.team.name} profile`}
                    className="h-14 w-14 object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center">
                    <Building2 className="h-6 w-6 text-[color-mix(in_srgb,#f6f7f9_55%,transparent)]" />
                  </span>
                )}
                <Link
                  href="/dashboard/settings/team"
                  className="absolute -bottom-2 -right-2 inline-flex h-7 w-7 items-center justify-center border border-[#f6f7f9] bg-[var(--accent)] text-[#f6f7f9] transition-colors hover:bg-[var(--accent-strong)]"
                  aria-label="Edit team profile picture"
                  title="Edit team profile picture"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="min-w-0">
                <p className="font-board text-xl font-semibold uppercase leading-tight tracking-[0.02em] text-[#f6f7f9]">
                  {ctx.team.name}
                </p>
                {ctx.team.school ? (
                  <p className="mt-1 text-xs leading-5 text-[color-mix(in_srgb,#f6f7f9_62%,transparent)]">
                    {ctx.team.school}
                  </p>
                ) : null}
              </div>
            </div>
            <WorkspaceInviteCode inviteCode={ctx.team.inviteCode} tone="dark" className="!mt-1" />
          </div>
        )}
      </header>

      {isManager && pendingJoinRequests > 0 && (
        <div className="pb-ticket">
          <div>
            <p className="pb-kicker">Needs attention</p>
            <p className="font-board mt-1 text-xl font-semibold uppercase tracking-[0.02em] text-[var(--foreground)]">
              {pendingJoinRequests === 1
                ? "1 join request waiting"
                : `${pendingJoinRequests} join requests waiting`}
            </p>
          </div>
          <Button href="/dashboard/join-requests" size="sm">
            Review requests
          </Button>
        </div>
      )}

      {/* Scoreboard — program status */}
      <section aria-label="Program status">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="pb-kicker">Scoreboard</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
            Live
          </p>
        </div>
        <div className="pb-scoreboard">
          <DashboardStatCard
            label="Account"
            value={accountValue}
            hint={accountHint}
          />
          <DashboardStatCard
            label="Team"
            value={ctx.team?.name ?? "No team yet"}
            hint={
              ctx.team
                ? isManager
                  ? managerTeamStatHint(ctx.team)
                  : playerTeamStatHint(ctx.team)
                : "Join with an invite code anytime"
            }
          />
          {isManager && ctx.team ? (
            <ManagerTeamSnapshotCard
              memberCount={ctx.team.memberCount}
              rosterSize={ctx.team.rosterSize}
              pendingJoinRequests={pendingJoinRequests}
              pendingInvites={managerAnalytics?.pendingInvites ?? 0}
            />
          ) : (
            <DashboardStatCard
              label={hasProfile ? "Your game" : "Profile"}
              value={hasProfile ? ctx.playerProfile!.game : "—"}
              hint={
                hasProfile
                  ? `${ctx.playerProfile!.role} · ${ctx.playerProfile!.rank}`
                  : "Set up your player profile"
              }
            />
          )}
          <DashboardStatCard
            label={isManager ? "Roster" : hasProfile ? "Status" : "Region"}
            value={
              isManager && ctx.team
                ? rosterStatValue(ctx.team)
                : isManager
                  ? "0"
                  : ctx.playerProfile?.status ?? ctx.team?.region ?? "Active"
            }
            hint={
              isManager
                ? rosterStatHint(managerAnalytics?.pendingInvites ?? 0)
                : ctx.team?.region ?? "Availability"
            }
          />
        </div>
      </section>

      {!isManager && ctx.playerProfile && (
        <section className="grid gap-4 sm:grid-cols-2">
          <PlayTimeWidget
            game={ctx.playerProfile.game}
            hoursPerWeek={ctx.playerProfile.hoursPerWeek}
          />
          <TeamInvitesWidget
            invites={pendingInvites}
            onTeam={!!ctx.team}
            currentTeamName={ctx.team?.name}
          />
        </section>
      )}

      <section className="space-y-6">
        {ctx.team && ctx.membershipRole === "player" && (
          <LeaveTeamCard
            teamName={ctx.team.name}
            membershipRole={ctx.membershipRole}
          />
        )}

        <DashboardAnalyticsCard
          accountType={ctx.accountType}
          accountTier={ctx.accountTier}
          playerAnalytics={playerAnalytics}
          managerAnalytics={managerAnalytics}
        />

        {isManager && ctx.team && (
          <RosterHubPreview
            members={rosterMembers}
            teamName={ctx.team.name}
            canManage={canEditTeam(ctx.membershipRole)}
          />
        )}

        {ctx.playerProfile && (
          <div className="pb-panel p-6">
            <p className="pb-kicker !text-[var(--foreground-muted)]">Player profile</p>
            <h2 className="font-board mt-3 text-3xl font-semibold uppercase tracking-[0.02em] text-[var(--foreground)]">
              {ctx.playerProfile.handle}
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {ctx.playerProfile.game} · {ctx.playerProfile.role} ·{" "}
              {ctx.playerProfile.rank}
            </p>
            {ctx.playerProfile.hoursPerWeek != null && (
              <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                <Clock className="mr-1.5 inline h-3.5 w-3.5 text-[var(--accent)]" />
                {ctx.playerProfile.hoursPerWeek} hrs/week on {ctx.playerProfile.game}{" "}
                <span className="text-[var(--foreground-muted)]">(self-reported)</span>
              </p>
            )}
            {ctx.playerProfile.bio && (
              <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">
                {ctx.playerProfile.bio}
              </p>
            )}
            {ctx.playerProfile.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {ctx.playerProfile.tags.map((tag) => (
                  <Badge key={tag} tone="violet">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button href="/dashboard/settings/profile" size="sm" variant="outline">
                Edit profile
              </Button>
              {!ctx.team && (
                <Button href="/dashboard/teams" size="sm" variant="ghost">
                  Browse teams
                </Button>
              )}
            </div>
          </div>
        )}

        {!ctx.team && !ctx.playerProfile && (
          <div className="border-2 border-dashed border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-sm text-[var(--foreground-muted)]">
              Finish setting up your profile to see more details here.
            </p>
            <Button href="/onboarding" className="mt-4" size="sm">
              Continue onboarding
            </Button>
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b-2 border-[var(--foreground)] pb-3">
          <div>
            <p className="pb-kicker">Work list</p>
            <h2 className="font-board mt-1 text-2xl font-semibold uppercase tracking-[0.03em] text-[var(--foreground)]">
              On the board
            </h2>
          </div>
          <p className="max-w-sm text-sm text-[var(--foreground-muted)]">
            {isManager
              ? isGrassroots
                ? "Recruiting and duels for the week ahead."
                : "Same tools from onboarding — lined up as today's work."
              : "Find a team and keep your scout card honest."}
          </p>
        </div>
        <div className="pb-work-list">
          {isManager ? (
            <>
              {!isGrassroots && (
                <FeatureTile
                  href="/dashboard/sponsorships"
                  title="Sponsor directory"
                  description="Browse our curated selection of sponsors and jump to application pages."
                  icon={Handshake}
                  tone="cyan"
                  index={nextIndex()}
                />
              )}
              <FeatureTile
                href="/dashboard/scout"
                title="Scout players"
                description={
                  isGrassroots
                    ? "Browse grassroots players, save candidates to your watchlist, and send invites."
                    : "Browse collegiate players at your school, save candidates, and send invites."
                }
                icon={Search}
                tone="violet"
                index={nextIndex()}
              />
              <FeatureTile
                href="/dashboard/roster"
                title="Roster hub"
                description="View and manage everyone on your roster — accepted invites appear automatically."
                icon={Users}
                tone="cyan"
                index={nextIndex()}
              />
              <FeatureTile
                href="/dashboard/join-requests"
                title="Join requests"
                description="See players who requested to join your org and send them a recruitment invite."
                icon={UserPlus}
                tone="cyan"
                index={nextIndex()}
              />
              <FeatureTile
                href="/dashboard/watchlist"
                title="Watchlist"
                description="Compare shortlisted players and send recruitment invites when you're ready."
                icon={Bookmark}
                tone="cyan"
                index={nextIndex()}
              />
              {isGrassroots && (
                <FeatureTile
                  href="/dashboard/duels"
                  title="Duels"
                  description="Challenge other grassroots teams and track pending, accepted, and completed duels."
                  icon={Swords}
                  tone="violet"
                  index={nextIndex()}
                />
              )}
              <FeatureTile
                href="/dashboard/settings/team"
                title="Team profile"
                description="Refine your org details, titles, and sponsorship signals."
                icon={Settings}
                tone="violet"
                index={nextIndex()}
              />
            </>
          ) : (
            <>
              <FeatureTile
                href="/dashboard/teams"
                title="Browse teams"
                description={
                  isGrassroots
                    ? "View grassroots orgs on Maxime and join one with an invite code."
                    : "View collegiate teams on Maxime and join one with an invite code."
                }
                icon={Building2}
                tone="cyan"
                index={nextIndex()}
              />
              <FeatureTile
                href="/dashboard/invites"
                title="Team invites"
                description={
                  pendingInvites.length > 0
                    ? `${pendingInvites.length} pending invite${pendingInvites.length === 1 ? "" : "s"} — accept or decline recruitment offers.`
                    : "See recruitment invites from teams and accept them when you're ready to join a roster."
                }
                icon={Mail}
                tone="violet"
                index={nextIndex()}
              />
              <FeatureTile
                href="/dashboard/settings/profile"
                title="Player profile"
                description="Update your handle, competitive info, play time, and scout card."
                icon={UserRound}
                tone="violet"
                index={nextIndex()}
              />
              <FeatureTile
                href="/dashboard/settings/account"
                title="Account settings"
                description="Email, display name, sign-in, and account preferences."
                icon={Settings}
                tone="cyan"
                index={nextIndex()}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
