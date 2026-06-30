import { Suspense } from "react";
import { Clock, Sparkles } from "lucide-react";
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
import { Bookmark, Building2, Handshake, Mail, Search, Settings, Swords, UserPlus, UserRound, Users } from "lucide-react";
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

export default async function DashboardPage() {
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

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <DashboardWelcomeMarker isFirstVisit={isFirstDashboardVisit} />
      <Suspense fallback={null}>
        <AuthNoticeBanner />
      </Suspense>
      {showDevPreview && <DeveloperMarketingPreview />}

      <header className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-cyan-400/[0.08] via-[var(--surface)] to-violet-500/[0.06] p-8 sm:p-10">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Your workspace
          </p>
          <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {isFirstDashboardVisit
              ? `Welcome, ${welcomeName}`
              : `Welcome back, ${welcomeName}`}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            {isManager
              ? isGrassroots
                ? "Run grassroots recruiting, challenge teams in Duels, and manage your roster."
                : "Manage sponsorship outreach, scout campus players, and keep your org profile in one place."
              : isGrassroots
                ? "Your grassroots player profile is live. Browse grassroots teams and join a roster when you're ready."
                : "Your collegiate player profile is live. Browse teams at your school and keep your scout card up to date."}
          </p>
          {ctx.email && (
            <p className="mt-2 text-sm text-zinc-500">{ctx.email}</p>
          )}
          {isManager && ctx.team && (
            <WorkspaceInviteCode inviteCode={ctx.team.inviteCode} />
          )}
        </div>
        <Sparkles className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-cyan-400/10" />
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Account"
          value={accountValue}
          hint={accountHint}
          icon={isManager ? Building2 : UserRound}
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
          icon={Building2}
        />
        {isManager && ctx.team ? (
          <ManagerTeamSnapshotCard
            memberCount={ctx.team.memberCount}
            rosterSize={ctx.team.rosterSize}
            pendingJoinRequests={managerAnalytics?.pendingJoinRequests ?? 0}
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
            icon={UserRound}
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
          icon={isManager ? Users : hasProfile ? Clock : Users}
        />
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
          <div
            className={
              ctx.team
                ? "rounded-2xl border border-white/5 bg-[var(--surface)] p-6"
                : "rounded-2xl border border-white/5 bg-[var(--surface)] p-6 lg:col-span-2"
            }
          >
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Player profile
            </p>
            <h2 className="font-heading mt-2 text-xl font-semibold text-white">
              {ctx.playerProfile.handle}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {ctx.playerProfile.game} · {ctx.playerProfile.role} ·{" "}
              {ctx.playerProfile.rank}
            </p>
            {ctx.playerProfile.hoursPerWeek != null && (
              <p className="mt-3 text-sm text-zinc-400">
                <Clock className="mr-1.5 inline h-3.5 w-3.5 text-cyan-400" />
                {ctx.playerProfile.hoursPerWeek} hrs/week on {ctx.playerProfile.game}{" "}
                <span className="text-zinc-600">(self-reported)</span>
              </p>
            )}
            {ctx.playerProfile.bio && (
              <p className="mt-4 text-sm leading-6 text-zinc-400">
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
          <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--surface)]/50 p-6 lg:col-span-2">
            <p className="text-sm text-zinc-400">
              Finish setting up your profile to see more details here.
            </p>
            <Button href="/onboarding" className="mt-4" size="sm">
              Continue onboarding
            </Button>
          </div>
        )}
      </section>

      <section>
        <div className="mb-5">
          <h2 className="font-heading text-xl font-semibold text-white">
            Platform features
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {isManager
              ? isGrassroots
                ? "Jump into grassroots recruiting and duels."
                : "Jump into the tools you set up during onboarding."
              : "Find a team and manage your player profile."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isManager ? (
            <>
              {!isGrassroots && (
                <FeatureTile
                  href="/dashboard/sponsorships"
                  title="Sponsor directory"
                  description="Browse our curated selection of sponsors and jump to application pages."
                  icon={Handshake}
                  tone="cyan"
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
              />
              <FeatureTile
                href="/dashboard/roster"
                title="Roster hub"
                description="View and manage everyone on your roster — accepted invites appear automatically."
                icon={Users}
                tone="cyan"
              />
              <FeatureTile
                href="/dashboard/join-requests"
                title="Join requests"
                description="See players who requested to join your org and send them a recruitment invite."
                icon={UserPlus}
                tone="cyan"
              />
              <FeatureTile
                href="/dashboard/watchlist"
                title="Watchlist"
                description="Compare shortlisted players and send recruitment invites when you're ready."
                icon={Bookmark}
                tone="cyan"
              />
              {isGrassroots && (
                <FeatureTile
                  href="/dashboard/duels"
                  title="Duels"
                  description="Challenge other grassroots teams and track pending, accepted, and completed duels."
                  icon={Swords}
                  tone="violet"
                />
              )}
              <FeatureTile
                href="/dashboard/settings/team"
                title="Team profile"
                description="Refine your org details, titles, and sponsorship signals."
                icon={Settings}
                tone="violet"
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
              />
              <FeatureTile
                href="/dashboard/settings/profile"
                title="Player profile"
                description="Update your handle, competitive info, play time, and scout card."
                icon={UserRound}
                tone="violet"
              />
              <FeatureTile
                href="/dashboard/settings/account"
                title="Account settings"
                description="Email, display name, sign-in, and account preferences."
                icon={Settings}
                tone="cyan"
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
