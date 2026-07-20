import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { isDeveloperEmail } from "@/lib/developer";
import { DeveloperMarketingPreview } from "@/components/dashboard/developer-marketing-preview";
import { AuthNoticeBanner } from "@/components/auth/auth-notice-banner";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import { LeaveTeamCard } from "@/components/dashboard/leave-team-card";
import { isVerifiedManager } from "@/lib/manager-verification";
import { DashboardWelcomeMarker } from "@/components/dashboard/dashboard-welcome-marker";
import { type DeskTicketItem } from "@/components/dashboard/desk-ui";
import {
  DeskBento,
  DeskBentoCell,
  DeskOrgCard,
  DeskScoutCard,
  DeskSetupCard,
  DeskQueueCompact,
  DeskPipelineCard,
  DeskQuickLinksCard,
  DeskRosterSnapshot,
  DeskUpdatesSnapshot,
  DeskAnalyticsSnapshot,
} from "@/components/dashboard/desk-bento";
import { getPlayerAnalytics } from "@/lib/player-analytics";
import { getManagerOrgAnalytics } from "@/lib/manager-analytics";
import { listDuelsForTeam } from "@/lib/duels";
import { getTeamSponsorLeads } from "@/lib/sponsor-pipeline";
import { fetchTeamRosterWithAvatars } from "@/lib/team-roster";
import { fetchNotifications } from "@/lib/notifications-db";

export const dynamic = "force-dynamic";

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
  const showTeamProfileSaved = params.saved === "team-profile";

  const [
    playerAnalytics,
    managerAnalytics,
    pendingInvites,
    incomingDuels,
    sponsorFollowUps,
    rosterMembers,
    notifications,
  ] = await Promise.all([
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
    isManager && ctx.team && isGrassroots
      ? listDuelsForTeam(ctx.team.id)
          .then((duels) =>
            duels.filter(
              (d) => d.status === "pending" && d.targetTeamId === ctx.team!.id,
            ),
          )
          .catch(() => [])
      : Promise.resolve([]),
    isManager && ctx.team && !isGrassroots
      ? getTeamSponsorLeads(ctx.team.id)
          .then((leads) =>
            leads.filter((l) => l.status === "applied" || l.status === "replied"),
          )
          .catch(() => [])
      : Promise.resolve([]),
    isManager && ctx.team
      ? fetchTeamRosterWithAvatars(ctx.team.id).catch(() => [])
      : Promise.resolve([]),
    fetchNotifications(ctx.userId, 5).catch(() => []),
  ]);

  const pendingJoinRequests = managerAnalytics?.pendingJoinRequests ?? 0;
  const pendingOutboundInvites = managerAnalytics?.pendingInvites ?? 0;
  const watchlistCount = managerAnalytics?.watchlistCount ?? 0;
  const verificationPending =
    isManager &&
    !!ctx.team &&
    !isVerifiedManager(ctx.managerVerificationStatus);

  const tickets: DeskTicketItem[] = [];

  if (isManager) {
    if (verificationPending) {
      tickets.push({
        id: "verify",
        title: "Verify your manager email",
        body: "Finish verification so players can trust invites from your org.",
        actionLabel: "Open account",
        href: "/dashboard/settings/account",
      });
    }
    if (pendingJoinRequests > 0) {
      tickets.push({
        id: "join-requests",
        title:
          pendingJoinRequests === 1
            ? "1 join request waiting"
            : `${pendingJoinRequests} join requests waiting`,
        body: "Players asked to join your roster. Review and send an invite when ready.",
        actionLabel: "Review",
        href: "/dashboard/join-requests",
      });
    }
    if (pendingOutboundInvites > 0) {
      tickets.push({
        id: "outbound-invites",
        title:
          pendingOutboundInvites === 1
            ? "1 invite awaiting a reply"
            : `${pendingOutboundInvites} invites awaiting a reply`,
        body: "Recruitment invites you sent are still open. Follow up from the roster or watchlist.",
        actionLabel: "Open roster",
        href: "/dashboard/roster",
      });
    }
    if (watchlistCount > 0 && pendingJoinRequests === 0) {
      tickets.push({
        id: "watchlist",
        title:
          watchlistCount === 1
            ? "1 player on your watchlist"
            : `${watchlistCount} players on your watchlist`,
        body: "Shortlisted talent is ready when you want to invite.",
        actionLabel: "Invite",
        href: "/dashboard/watchlist",
      });
    }
    if (incomingDuels.length > 0) {
      tickets.push({
        id: "duels",
        title:
          incomingDuels.length === 1
            ? "1 duel challenge to answer"
            : `${incomingDuels.length} duel challenges to answer`,
        body: "Another grassroots team challenged you. Accept or decline.",
        actionLabel: "Respond",
        href: "/dashboard/duels",
      });
    }
    if (sponsorFollowUps.length > 0) {
      tickets.push({
        id: "sponsors",
        title:
          sponsorFollowUps.length === 1
            ? "1 sponsor lead needs a follow-up"
            : `${sponsorFollowUps.length} sponsor leads need a follow-up`,
        body: "Applications or replies are sitting in your pipeline.",
        actionLabel: "Open sponsors",
        href: "/dashboard/sponsorships",
      });
    }
    if (!ctx.team) {
      tickets.push({
        id: "setup-team",
        title: "Finish setting up your org",
        body: "Your desk needs a team profile before scouting and invites unlock.",
        actionLabel: "Continue setup",
        href: "/onboarding",
      });
    }
  } else {
    if (pendingInvites.length > 0) {
      tickets.push({
        id: "team-invites",
        title:
          pendingInvites.length === 1
            ? "1 team invite waiting"
            : `${pendingInvites.length} team invites waiting`,
        body: "A manager wants you on their roster. Accept or decline.",
        actionLabel: "Review",
        href: "/dashboard/invites",
      });
    }
    if (!hasProfile) {
      tickets.push({
        id: "profile",
        title: "Build your scout card",
        body: "Managers find you by game, role, and rank — finish your profile.",
        actionLabel: "Edit profile",
        href: "/dashboard/settings/profile",
      });
    }
    if (hasProfile && !ctx.team && pendingInvites.length === 0) {
      tickets.push({
        id: "find-team",
        title: "Find a roster",
        body: "Browse teams on Maxime or join with an invite code.",
        actionLabel: "Browse teams",
        href: "/dashboard/teams",
      });
    }
  }

  const emptyQueue = isManager
    ? {
        title: "No open work",
        body: isGrassroots
          ? "Scout players, share your invite code, or challenge another grassroots team."
          : "Scout campus talent, share your invite code, or check the sponsor directory.",
        actionLabel: "Open scout",
        actionHref: "/dashboard/scout",
      }
    : {
        title: "Nothing waiting",
        body: hasProfile
          ? "Your scout card is live. Browse teams when you're ready to join."
          : "Finish your scout card so managers can find you.",
        actionLabel: hasProfile ? "Browse teams" : "Edit profile",
        actionHref: hasProfile
          ? "/dashboard/teams"
          : "/dashboard/settings/profile",
      };

  const deskIntro = isFirstDashboardVisit
    ? `Welcome, ${welcomeName}. This desk shows what needs a hand today.`
    : `Welcome back, ${welcomeName}.`;

  const showAnalytics = !!(playerAnalytics || managerAnalytics);
  const hasOrg = isManager && !!ctx.team;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <DashboardWelcomeMarker isFirstVisit={isFirstDashboardVisit} />
      <Suspense fallback={null}>
        <AuthNoticeBanner />
      </Suspense>
      {showTeamProfileSaved && (
        <div className="flex items-start gap-2 border border-[color-mix(in_srgb,var(--success)_45%,var(--border))] bg-[color-mix(in_srgb,var(--success)_8%,transparent)] px-4 py-3 text-sm text-[var(--success)]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Team profile saved. Your updated picture and details are now live.
        </div>
      )}
      {showDevPreview && <DeveloperMarketingPreview />}

      <div className="space-y-1.5">
        <p className="desk-kicker">
          {isManager
            ? isGrassroots
              ? "Grassroots desk"
              : "Collegiate desk"
            : "Player desk"}
        </p>
        <h1 className="font-heading text-[1.45rem] font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-[1.65rem]">
          {deskIntro}
        </h1>
      </div>

      <DeskBento>
        <DeskBentoCell span="md" tall>
          {hasOrg ? (
            <DeskOrgCard
              team={ctx.team!}
              membershipRole={ctx.membershipRole}
              pendingInvites={pendingOutboundInvites}
            />
          ) : hasProfile ? (
            <DeskScoutCard
              handle={ctx.playerProfile!.handle}
              game={ctx.playerProfile!.game}
              role={ctx.playerProfile!.role}
              rank={ctx.playerProfile!.rank}
              bio={ctx.playerProfile!.bio}
              tags={ctx.playerProfile!.tags}
              teamName={ctx.team?.name ?? null}
            />
          ) : (
            <DeskSetupCard />
          )}
        </DeskBentoCell>

        <DeskBentoCell span="lg" tall>
          <DeskQueueCompact
            tickets={tickets}
            emptyTitle={emptyQueue.title}
            emptyBody={emptyQueue.body}
            emptyActionLabel={emptyQueue.actionLabel}
            emptyActionHref={emptyQueue.actionHref}
          />
        </DeskBentoCell>

        <DeskBentoCell span="sm" tall>
          {hasOrg ? (
            <DeskPipelineCard
              pendingJoinRequests={pendingJoinRequests}
              pendingInvites={pendingOutboundInvites}
              watchlistCount={watchlistCount}
              isGrassroots={isGrassroots}
              incomingDuels={incomingDuels.length}
              sponsorFollowUps={sponsorFollowUps.length}
            />
          ) : (
            <DeskQuickLinksCard
              isManager={isManager}
              isGrassroots={isGrassroots}
              hasTeam={!!ctx.team}
            />
          )}
        </DeskBentoCell>

        {hasOrg ? (
          <DeskBentoCell span={showAnalytics ? "md" : "xl"} tall>
            <DeskRosterSnapshot
              members={rosterMembers}
              teamName={ctx.team!.name}
              rosterSize={ctx.team!.rosterSize}
            />
          </DeskBentoCell>
        ) : null}

        {showAnalytics ? (
          <DeskBentoCell span={hasOrg ? "lg" : "xl"} tall>
            <DeskAnalyticsSnapshot
              accountType={ctx.accountType}
              managerAnalytics={managerAnalytics}
              playerAnalytics={playerAnalytics}
            />
          </DeskBentoCell>
        ) : null}

        <DeskBentoCell
          span={
            hasOrg && showAnalytics
              ? "sm"
              : showAnalytics || hasOrg
                ? "md"
                : "full"
          }
          tall
        >
          <DeskUpdatesSnapshot notifications={notifications} />
        </DeskBentoCell>
      </DeskBento>

      {ctx.team && ctx.membershipRole === "player" && (
        <LeaveTeamCard
          teamName={ctx.team.name}
          membershipRole={ctx.membershipRole}
        />
      )}
    </div>
  );
}
