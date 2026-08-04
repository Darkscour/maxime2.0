import { Suspense } from "react";
import { getDashboardContext } from "@/lib/auth-user";
import { AuthNoticeBanner } from "@/components/auth/auth-notice-banner";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import { isVerifiedManager } from "@/lib/manager-verification";
import { getPlayerAnalytics } from "@/lib/player-analytics";
import { getManagerOrgAnalytics } from "@/lib/manager-analytics";
import { listDuelsForTeam } from "@/lib/duels";
import { getTeamSponsorLeads } from "@/lib/sponsor-pipeline";
import { fetchTeamRosterWithAvatars } from "@/lib/team-roster";
import { fetchNotifications } from "@/lib/notifications-db";
import { getInstitutionById } from "@/lib/institutions";
import { resolveCollegiateRegionDisplay } from "@/lib/onboarding-options";
import {
  DeskMantineView,
  type DeskActivityItem,
  type DeskComplianceItem,
  type DeskMovement,
  type DeskOverview,
  type DeskSignal,
  type DeskViewProps,
} from "@/components/dashboard/desk-mantine";

export const dynamic = "force-dynamic";

const CURRENT_MONTH = () =>
  new Date().toLocaleString(undefined, { month: "long" });

function trendPct(current: number, prior: number): number | null {
  if (prior === 0) return current > 0 ? 100 : null;
  return Math.round(((current - prior) / prior) * 100);
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function notificationStatus(
  type: string,
  read: boolean,
): DeskActivityItem["status"] {
  if (read) return "neutral";
  if (type === "recruitment" || type === "invite") return "warn";
  if (type === "analytics") return "good";
  return "pending";
}

function tagsCount(profile: { tags: string[] | null | undefined } | null | undefined): number {
  return profile?.tags?.length ?? 0;
}

export default async function DashboardPage() {
  const ctx = await getDashboardContext();
  const isManager = ctx.accountType === "team_manager";
  const isGrassroots = ctx.accountTier === "grassroots";

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
      ? getPlayerAnalytics(ctx.playerProfile.id, ctx.playerProfile.hoursPerWeek)
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
    fetchNotifications(ctx.userId, 12).catch(() => []),
  ]);

  const activity: DeskActivityItem[] = notifications.map((n) => ({
    id: n.id,
    type: n.type
      ? n.type.slice(0, 1).toUpperCase() + n.type.slice(1)
      : "Update",
    title: n.title,
    when: relativeTime(new Date(n.createdAt)),
    status: notificationStatus(n.type, n.read),
    href: n.href,
  }));

  const collegiateInstitutionState =
    ctx.team?.institutionId && !isGrassroots
      ? ((await getInstitutionById(ctx.team.institutionId))?.state ?? null)
      : null;

  const playerInstitutionState =
    !isManager &&
    ctx.playerProfile?.institutionId &&
    ctx.accountTier === "collegiate"
      ? ((await getInstitutionById(ctx.playerProfile.institutionId))?.state ??
        null)
      : null;

  const view: DeskViewProps = isManager
    ? buildManagerView({
        ctx,
        managerAnalytics,
        rosterMembers,
        incomingDuels,
        sponsorFollowUps,
        activity,
        collegiateInstitutionState,
      })
    : buildPlayerView({
        ctx,
        playerAnalytics,
        pendingInvitesCount: pendingInvites.length,
        activity,
        playerInstitutionState,
      });

  return (
    <>
      <Suspense fallback={null}>
        <AuthNoticeBanner />
      </Suspense>
      <DeskMantineView {...view} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Manager view

type Ctx = Awaited<ReturnType<typeof getDashboardContext>>;

function buildManagerView(input: {
  ctx: Ctx;
  managerAnalytics: Awaited<ReturnType<typeof getManagerOrgAnalytics>> | null;
  rosterMembers: Awaited<ReturnType<typeof fetchTeamRosterWithAvatars>>;
  incomingDuels: Awaited<ReturnType<typeof listDuelsForTeam>>;
  sponsorFollowUps: Awaited<ReturnType<typeof getTeamSponsorLeads>>;
  activity: DeskActivityItem[];
  collegiateInstitutionState: string | null;
}): DeskViewProps {
  const {
    ctx,
    managerAnalytics,
    rosterMembers,
    incomingDuels,
    sponsorFollowUps,
    activity,
    collegiateInstitutionState,
  } = input;
  const team = ctx.team;
  const isGrassroots = ctx.accountTier === "grassroots";
  const rosterSize = team?.rosterSize ?? null;
  const memberCount = team?.memberCount ?? 0;
  const rosterLabel = rosterSize ? `${memberCount} / ${rosterSize}` : String(memberCount);
  const regionDisplay = isGrassroots
    ? team?.region?.trim() || "—"
    : resolveCollegiateRegionDisplay({
        region: team?.region,
        institutionState: collegiateInstitutionState,
      });

  // Signals
  const scoutViewsSeries = managerAnalytics?.scoutViews.weekly.map((p) => p.value) ?? [];
  const scoutViewsNow = scoutViewsSeries.at(-1) ?? 0;
  const scoutViewsPrior = scoutViewsSeries.at(-2) ?? 0;
  const scoutViewsTrend = trendPct(scoutViewsNow, scoutViewsPrior);

  const signals: [DeskSignal, DeskSignal, DeskSignal] = [
    {
      label: "Scout views",
      value: String(managerAnalytics?.scoutSummary.weekly.profileViews ?? 0),
      trendPct: scoutViewsTrend,
      caption: "This week",
      href: "/dashboard/scout",
    },
    {
      label: "Join requests",
      value: String(managerAnalytics?.pendingJoinRequests ?? 0),
      trendPct: null,
      caption: "Awaiting review",
      href: "/dashboard/join-requests",
    },
    isGrassroots
      ? {
          label: "Duels",
          value: String(incomingDuels.length),
          trendPct: null,
          caption: "Incoming challenges",
          href: "/dashboard/duels",
        }
      : {
          label: "Sponsor leads",
          value: String(sponsorFollowUps.length),
          trendPct: null,
          caption: "Applied · Replied",
          href: "/dashboard/sponsorships",
        },
  ];

  // Compliance
  const compliance: DeskComplianceItem[] = [];
  compliance.push({
    label: team?.name
      ? `Team profile set — ${team.name}`
      : "Team profile — finish setup",
    status: team ? "good" : "warn",
  });
  compliance.push({
    label: rosterSize
      ? `${memberCount} of ${rosterSize} rostered`
      : `${memberCount} players on roster`,
    status:
      rosterSize && memberCount >= rosterSize
        ? "good"
        : memberCount === 0
          ? "warn"
          : "pending",
  });
  compliance.push({
    label: isVerifiedManager(ctx.managerVerificationStatus)
      ? "Manager email verified"
      : "Verify your manager email",
    status: isVerifiedManager(ctx.managerVerificationStatus) ? "good" : "warn",
  });

  // Movement
  const joinsThisWindow = managerAnalytics?.rosterSummary.weekly.newJoins ?? 0;
  const pendingInvites = managerAnalytics?.pendingInvites ?? 0;
  const pendingJoinRequests = managerAnalytics?.pendingJoinRequests ?? 0;
  const playerCount = managerAnalytics?.playerCount ?? memberCount;
  const openSlots =
    rosterSize != null && rosterSize > 0 ? Math.max(0, rosterSize - memberCount) : null;
  const fillPct =
    rosterSize != null && rosterSize > 0
      ? Math.round((memberCount / rosterSize) * 100)
      : null;
  const fillCaption =
    openSlots != null
      ? openSlots === 0
        ? "Roster full"
        : openSlots === 1
          ? "1 slot open"
          : `${openSlots} slots open`
      : `${memberCount} member${memberCount === 1 ? "" : "s"}`;

  const movement: DeskMovement = {
    title: "Roster movement",
    monthLabel: CURRENT_MONTH(),
    primaryLabel: "Active roster",
    primaryValue: rosterLabel,
    changeAnnotation: null,
    trendPct: null,
    splitA: { label: "Joined", value: String(joinsThisWindow) },
    splitB: { label: "Open slots", value: openSlots != null ? String(openSlots) : "—" },
    breakdown: [],
    ctaLabel: "Manage roster",
    ctaHref: "/dashboard/roster",
    variant: "roster",
    fillPct,
    fillCaption,
    stats: [
      {
        label: "Joined this week",
        value: String(joinsThisWindow),
      },
      {
        label: "Pending invites",
        value: String(pendingInvites),
        href: pendingInvites > 0 ? "/dashboard/roster" : undefined,
      },
      {
        label: "Join requests",
        value: String(pendingJoinRequests),
        href: pendingJoinRequests > 0 ? "/dashboard/join-requests" : undefined,
      },
      {
        label: "Players",
        value: String(playerCount),
      },
    ],
  };

  // Overview
  const overview: DeskOverview = {
    title: "Analytics",
    labels: managerAnalytics?.rosterSize.weekly.map((p) => p.label) ?? [],
    series: {
      label: "Roster size",
      values: managerAnalytics?.rosterSize.weekly.map((p) => p.value) ?? [],
    },
  };

  return {
    audience: isGrassroots ? "manager_grassroots" : "manager_collegiate",
    identity: {
      kind: "org",
      name: team?.name ?? "Your org",
      subLabel: team?.school ?? (isGrassroots ? "Grassroots" : "Collegiate"),
      code: team?.inviteCode ? `MX · ${team.inviteCode}` : "invite code pending",
      inviteCode: team?.inviteCode ?? null,
      balanceLabel: "Active roster",
      balanceValue: rosterLabel,
      chainLabel: "Region",
      chainValue: regionDisplay,
      imageUrl: team?.profileImageUrl ?? null,
      editProfileHref: "/dashboard/settings/team",
      primaryCta: { label: "Invite", href: "/dashboard/roster" },
      secondaryCta: { label: "Roster", href: "/dashboard/roster" },
    },
    teamProfileSnapshot: team
      ? {
          name: team.name,
          school: team.school ?? "",
          games: team.games ?? [],
          region: team.region ?? "",
          rosterSize: team.rosterSize,
          discordUrl: team.discordUrl ?? null,
        }
      : null,
    compliance: {
      title: isGrassroots ? "Team health" : "Program health",
      subtitle: team?.name ? `${team.name} · ${CURRENT_MONTH()}` : CURRENT_MONTH(),
      items: compliance,
    },
    signals,
    movement,
    overview,
    activity,
  };
}

// ────────────────────────────────────────────────────────────────────────
// Player view

function buildPlayerView(input: {
  ctx: Ctx;
  playerAnalytics: Awaited<ReturnType<typeof getPlayerAnalytics>> | null;
  pendingInvitesCount: number;
  activity: DeskActivityItem[];
  playerInstitutionState: string | null;
}): DeskViewProps {
  const {
    ctx,
    playerAnalytics,
    pendingInvitesCount,
    activity,
    playerInstitutionState,
  } = input;
  const profile = ctx.playerProfile;
  const isGrassroots = ctx.accountTier === "grassroots";
  const teamName = ctx.team?.name ?? null;

  const viewsNow =
    playerAnalytics?.weeklyProfileViews.at(-1) ?? 0;
  const viewsPrior =
    playerAnalytics?.weeklyProfileViews.at(-2) ?? 0;
  const scoutsWatching = playerAnalytics?.uniqueScoutTeams ?? 0;

  const signals: [DeskSignal, DeskSignal, DeskSignal] = [
    {
      label: "Profile views",
      value: String(viewsNow),
      trendPct: playerAnalytics?.profileViewsTrend ?? null,
      caption: "This week",
    },
    {
      label: "Invites",
      value: String(pendingInvitesCount),
      trendPct: null,
      caption: "Awaiting reply",
      href: "/dashboard/invites",
    },
    {
      label: "Scouts watching",
      value: String(playerAnalytics?.uniqueScoutTeams ?? 0),
      trendPct: null,
      caption: "Unique teams",
    },
  ];

  const compliance: DeskComplianceItem[] = [
    {
      label: profile
        ? tagsCount(profile) >= 2
          ? "Scout card ready — tags and bio set"
          : "Add 2+ tags so managers can find you"
        : "Finish your scout card",
      status: profile ? (tagsCount(profile) >= 2 ? "good" : "pending") : "warn",
    },
    {
      label:
        pendingInvitesCount > 0
          ? `${pendingInvitesCount} team invite${pendingInvitesCount === 1 ? "" : "s"} waiting on you`
          : "No open invites",
      status: pendingInvitesCount > 0 ? "warn" : "pending",
    },
    {
      label:
        scoutsWatching > 0
          ? `${scoutsWatching} scout team${scoutsWatching === 1 ? "" : "s"} watching`
          : "No scout teams watching yet",
      status: scoutsWatching > 0 ? "good" : "pending",
    },
  ];

  const viewsTrend = trendPct(viewsNow, viewsPrior);
  const viewsChangeAnnotation =
    viewsPrior > 0 && viewsNow !== viewsPrior
      ? `${viewsNow > viewsPrior ? "+" : ""}${viewsNow - viewsPrior} vs last week`
      : viewsNow > 0
        ? "Steady week"
        : "Get discovered — complete your scout card";

  const movement: DeskMovement = {
    title: "Scout visibility",
    monthLabel: CURRENT_MONTH(),
    primaryLabel: "Profile views",
    primaryValue: String(viewsNow),
    changeAnnotation: viewsChangeAnnotation,
    trendPct: viewsTrend,
    splitA: { label: "Scouts watching", value: String(scoutsWatching) },
    splitB: { label: "Invites", value: String(pendingInvitesCount) },
    breakdown: profile
      ? [
          { label: "Game", value: profile.game },
          ...(profile.role
            ? [{ label: "Role", value: profile.role }]
            : []),
          ...(profile.rank ? [{ label: "Rank", value: profile.rank }] : []),
        ]
      : [],
    ctaLabel: "Edit scout profile",
    ctaHref: "/dashboard/settings/profile",
  };

  const overview: DeskOverview = {
    title: "Analytics",
    labels: playerAnalytics?.weekLabels ?? [],
    series: {
      label: "Profile views",
      values: playerAnalytics?.weeklyProfileViews ?? [],
    },
  };

  return {
    audience: isGrassroots ? "player_grassroots" : "player_collegiate",
    identity: {
      kind: "player",
      name: profile?.handle ? `@${profile.handle}` : "Set your handle",
      subLabel: profile
        ? [profile.game, profile.role, profile.rank].filter(Boolean).join(" · ")
        : "Complete your scout card",
      code: profile
        ? `${profile.region ?? "—"} · ${teamName ? `Roster · ${teamName}` : "Free agent"}`
        : "no profile yet",
      balanceLabel: teamName ? "Team" : "Status",
      balanceValue: teamName ?? "Free agent",
      chainLabel: "Region",
      chainValue: isGrassroots
        ? profile?.region?.trim() || "—"
        : resolveCollegiateRegionDisplay({
            region: profile?.region,
            institutionState: playerInstitutionState,
          }),
      primaryCta: teamName
        ? { label: "Leave team", action: "leave-team" }
        : { label: "Browse teams", href: "/dashboard/teams" },
      secondaryCta: { label: "Edit profile", href: "/dashboard/settings/profile" },
      editProfileHref: "/dashboard/settings/profile",
    },
    compliance: {
      title: "Scout status",
      subtitle: "Your recruitment visibility",
      items: compliance,
    },
    signals,
    movement,
    overview,
    activity,
  };
}
