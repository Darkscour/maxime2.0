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
import { PlayTimeReport } from "@/components/dashboard/play-time-report";
import { TeamOverviewCard } from "@/components/dashboard/team-overview-card";
import { DashboardAnalyticsCard } from "@/components/dashboard/dashboard-analytics-card";
import { getPlayerAnalytics } from "@/lib/player-analytics";
import { AuthNoticeBanner } from "@/components/auth/auth-notice-banner";
import { Bookmark, Building2, Handshake, Search, Settings, UserRound, Users } from "lucide-react";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import { PendingInvitesCard } from "@/components/dashboard/pending-invites-card";
import { LeaveTeamCard } from "@/components/dashboard/leave-team-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const ctx = await getDashboardContext();
  const firstName = ctx.displayName?.split(" ")[0] ?? "there";
  const isManager = ctx.accountType === "team_manager";
  const hasProfile = !!ctx.playerProfile;
  const showDevPreview = isDeveloperEmail(ctx.email);
  const playerAnalytics =
    !isManager && ctx.playerProfile
      ? await getPlayerAnalytics(
          ctx.playerProfile.id,
          ctx.playerProfile.hoursPerWeek,
        )
      : null;

  const pendingInvites =
    !isManager && ctx.playerProfile
      ? await fetchPendingInvitesForPlayer(ctx.playerProfile.id)
      : [];

  return (
    <div className="mx-auto max-w-6xl space-y-10">
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
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            {isManager
              ? "Manage sponsorship outreach, scout players, and keep your org profile in one place."
              : "Your player profile is live. Browse registered teams, join a roster, and keep your scout card up to date."}
          </p>
          {ctx.email && (
            <p className="mt-2 text-sm text-zinc-500">{ctx.email}</p>
          )}
        </div>
        <Sparkles className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-cyan-400/10" />
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Account"
          value={isManager ? "Team manager" : "Player"}
          hint={ctx.membershipRole ? `Role: ${ctx.membershipRole}` : "Individual account"}
          icon={isManager ? Building2 : UserRound}
        />
        <DashboardStatCard
          label="Team"
          value={ctx.team?.name ?? "No team yet"}
          hint={ctx.team?.school ?? "Join with an invite code anytime"}
          icon={Building2}
        />
        <DashboardStatCard
          label={hasProfile ? "Your game" : "Titles"}
          value={
            hasProfile
              ? ctx.playerProfile!.game
              : ctx.team?.games.length
                ? String(ctx.team.games.length)
                : "—"
          }
          hint={
            hasProfile
              ? `${ctx.playerProfile!.role} · ${ctx.playerProfile!.rank}`
              : ctx.team?.games.length
                ? ctx.team.games.length <= 2
                  ? ctx.team.games.join(", ")
                  : `${ctx.team.games.length} active titles`
                : isManager
                  ? "Add titles in team settings"
                  : "Browse teams to find a roster"
          }
          icon={UserRound}
        />
        <DashboardStatCard
          label={hasProfile ? "Play time" : "Status"}
          value={
            ctx.playerProfile?.hoursPerWeek != null
              ? `${ctx.playerProfile.hoursPerWeek} hrs/wk`
              : ctx.playerProfile?.status ?? "Active"
          }
          hint={
            hasProfile
              ? ctx.playerProfile!.hoursPerWeek != null
                ? `Self-reported · ${ctx.playerProfile!.game}`
                : "Report your hours below"
              : (ctx.team?.region ?? "Region not set")
          }
          icon={hasProfile ? Clock : Users}
        />
      </section>

      {ctx.playerProfile && (
        <PlayTimeReport
          game={ctx.playerProfile.game}
          hoursPerWeek={ctx.playerProfile.hoursPerWeek}
          updatedAt={ctx.playerProfile.updatedAt.toISOString()}
        />
      )}

      <section className="space-y-6">
        {pendingInvites.length > 0 && (
          <PendingInvitesCard
            invites={pendingInvites}
            onTeam={!!ctx.team}
            currentTeamName={ctx.team?.name}
          />
        )}

        {ctx.team && ctx.membershipRole === "player" && (
          <LeaveTeamCard
            teamName={ctx.team.name}
            membershipRole={ctx.membershipRole}
          />
        )}

        <DashboardAnalyticsCard
          accountType={ctx.accountType}
          playerAnalytics={playerAnalytics}
        />

        {ctx.team && (
          <TeamOverviewCard
            team={ctx.team}
            membershipRole={ctx.membershipRole}
            managerVerificationStatus={ctx.managerVerificationStatus}
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
              ? "Jump into the tools you set up during onboarding."
              : "Find a team and manage your player profile."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isManager ? (
            <>
              <FeatureTile
                href="/dashboard/sponsorships"
                title="Sponsor directory"
                description="Browse our curated selection of sponsors and jump to application pages."
                icon={Handshake}
                tone="cyan"
              />
              <FeatureTile
                href="/dashboard/scout"
                title="Scout players"
                description="Browse registered players, save candidates to your watchlist, and send invites."
                icon={Search}
                tone="violet"
              />
              <FeatureTile
                href="/dashboard/watchlist"
                title="Watchlist"
                description="Compare shortlisted players and send recruitment invites when you're ready."
                icon={Bookmark}
                tone="cyan"
              />
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
                description="View orgs registered on Maxime and join one with an invite code."
                icon={Building2}
                tone="cyan"
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
