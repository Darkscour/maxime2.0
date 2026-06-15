import { db } from "@/lib/db";
import { watchlistCount } from "@/lib/player-watchlist-db";
import { countPendingJoinRequestsForTeam } from "@/lib/team-join-request-db";

export const MANAGER_ANALYTICS_RECENT_WEEKS = 8;

export type ManagerAnalyticsPoint = {
  /** Week starting (ISO date) */
  date: string;
  /** Short axis label */
  label: string;
  value: number;
};

export type ManagerAnalyticsSeries = {
  weekly: ManagerAnalyticsPoint[];
  allTime: ManagerAnalyticsPoint[];
};

export type ManagerAnalyticsSummary = {
  newJoins: number;
};

export type ManagerScoutSummary = {
  profileViews: number;
  joinRequests: number;
  invitesSent: number;
  invitesAccepted: number;
};

export type ManagerOrgAnalytics = {
  teamJoinedAt: string;
  rosterCount: number;
  playerCount: number;
  pendingJoinRequests: number;
  pendingInvites: number;
  watchlistCount: number;
  rosterSize: ManagerAnalyticsSeries;
  scoutViews: ManagerAnalyticsSeries;
  rosterSummary: {
    weekly: ManagerAnalyticsSummary;
    allTime: ManagerAnalyticsSummary;
  };
  scoutSummary: {
    weekly: ManagerScoutSummary;
    allTime: ManagerScoutSummary;
  };
};

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function weekKey(date: Date): string {
  const d = startOfWeek(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatAxisLabel(
  weekStart: Date,
  options: {
    isCurrentWeek: boolean;
    isOriginWeek: boolean;
    originDate?: Date;
  },
): string {
  if (options.isCurrentWeek) return "Now";
  if (options.isOriginWeek && options.originDate) {
    return options.originDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  return weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTooltipDateFrom(origin: Date, weekEnd: Date): string {
  const startStr = origin.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endStr = weekEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

function endOfWeek(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 7);
  end.setMilliseconds(-1);
  return end;
}


function formatTooltipDate(weekStart: Date): string {
  const end = endOfWeek(weekStart);
  const startStr = weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endStr = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

type WeekBucket = {
  key: string;
  label: string;
  start: Date;
  end: Date;
  tooltipDate: string;
};

function buildWeekBucketsFrom(teamJoinedAt: Date, through: Date): WeekBucket[] {
  const originWeekStart = startOfWeek(teamJoinedAt);
  const last = startOfWeek(through);
  const buckets: WeekBucket[] = [];
  const cursor = new Date(originWeekStart);
  const currentWeekKey = weekKey(through);

  while (cursor <= last) {
    const key = weekKey(cursor);
    const isOriginWeek = cursor.getTime() === originWeekStart.getTime();
    const weekEnd = endOfWeek(cursor);
    buckets.push({
      key,
      label: formatAxisLabel(cursor, {
        isCurrentWeek: key === currentWeekKey,
        isOriginWeek,
        originDate: teamJoinedAt,
      }),
      start: new Date(cursor),
      end: weekEnd,
      tooltipDate: isOriginWeek
        ? formatTooltipDateFrom(teamJoinedAt, weekEnd)
        : formatTooltipDate(cursor),
    });
    cursor.setDate(cursor.getDate() + 7);
  }

  return buckets;
}

/** Recent window anchored to team creation — never shows weeks before the team existed. */
function buildRecentWeekBuckets(
  teamJoinedAt: Date,
  through: Date,
  maxWeeks: number,
): WeekBucket[] {
  const all = buildWeekBucketsFrom(teamJoinedAt, through);
  if (all.length <= maxWeeks) return all;
  return all.slice(-maxWeeks);
}

function rosterSizeAt(
  members: { createdAt: Date }[],
  asOf: Date,
  teamJoinedAt: Date,
): number {
  if (asOf < teamJoinedAt) return 0;
  return members.filter((m) => m.createdAt <= asOf).length;
}

function countInWeek(
  dates: Date[],
  bucket: WeekBucket,
  notBefore?: Date,
): number {
  const start =
    notBefore && bucket.start < notBefore ? notBefore : bucket.start;
  return dates.filter((d) => d >= start && d <= bucket.end).length;
}

function countSince(dates: Date[], since: Date): number {
  return dates.filter((d) => d >= since).length;
}

function sumSeries(points: ManagerAnalyticsPoint[]): number {
  return points.reduce((total, point) => total + point.value, 0);
}

function toSeries(
  buckets: WeekBucket[],
  values: number[],
): ManagerAnalyticsPoint[] {
  return buckets.map((bucket, i) => ({
    date: bucket.tooltipDate,
    label: bucket.label,
    value: values[i] ?? 0,
  }));
}

function scoutSummaryForRange(
  viewDates: Date[],
  joinRequestDates: Date[],
  inviteDates: Date[],
  invitesAccepted: number,
  since: Date,
  profileViewPoints: ManagerAnalyticsPoint[],
): ManagerScoutSummary {
  return {
    profileViews: sumSeries(profileViewPoints),
    joinRequests: countSince(joinRequestDates, since),
    invitesSent: countSince(inviteDates, since),
    invitesAccepted,
  };
}

export async function getManagerOrgAnalytics(
  teamId: string,
): Promise<ManagerOrgAnalytics> {
  const now = new Date();

  const [team, members, pendingInvites, acceptedInvites, pendingJoinRequests, watchlistTotal, scoutViewDates, inviteDates, joinRequestDates] =
    await Promise.all([
      db.team.findUnique({
        where: { id: teamId },
        select: { createdAt: true },
      }),
      db.teamMembership.findMany({
        where: { teamId, status: "active" },
        select: { role: true, createdAt: true },
      }),
      db.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count
        FROM "PlayerRecruitmentInvite"
        WHERE "teamId" = ${teamId} AND "status" = 'pending'
      `.catch(() => [{ count: BigInt(0) }]),
      db.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count
        FROM "PlayerRecruitmentInvite"
        WHERE "teamId" = ${teamId} AND "status" = 'accepted'
      `.catch(() => [{ count: BigInt(0) }]),
      countPendingJoinRequestsForTeam(teamId).catch(() => 0),
      watchlistCount(teamId).catch(() => 0),
      db.$queryRaw<{ createdAt: Date }[]>`
        SELECT "createdAt"
        FROM "PlayerProfileView"
        WHERE "viewerTeamId" = ${teamId}
      `.catch(() => []),
      db.$queryRaw<{ createdAt: Date }[]>`
        SELECT "createdAt"
        FROM "PlayerRecruitmentInvite"
        WHERE "teamId" = ${teamId}
      `.catch(() => []),
      db.$queryRaw<{ createdAt: Date }[]>`
        SELECT "createdAt"
        FROM "TeamJoinRequest"
        WHERE "teamId" = ${teamId}
      `.catch(() => []),
    ]);

  const teamJoinedAt = team?.createdAt ?? now;
  const allBuckets = buildWeekBucketsFrom(teamJoinedAt, now);
  const recentBuckets = buildRecentWeekBuckets(
    teamJoinedAt,
    now,
    MANAGER_ANALYTICS_RECENT_WEEKS,
  );

  const viewDates = scoutViewDates.map((r) => r.createdAt);
  const invites = inviteDates.map((r) => r.createdAt);
  const joinRequests = joinRequestDates.map((r) => r.createdAt);
  const memberJoinDates = members.map((m) => m.createdAt);
  const invitesAccepted = Number(acceptedInvites[0]?.count ?? 0);

  const rosterAllTime = allBuckets.map((b) =>
    rosterSizeAt(members, b.end, teamJoinedAt),
  );
  const rosterWeekly = recentBuckets.map((b) =>
    rosterSizeAt(members, b.end, teamJoinedAt),
  );
  const scoutAllTime = allBuckets.map((b) =>
    countInWeek(viewDates, b, teamJoinedAt),
  );
  const scoutWeekly = recentBuckets.map((b) =>
    countInWeek(viewDates, b, teamJoinedAt),
  );

  const rosterSizeWeekly = toSeries(recentBuckets, rosterWeekly);
  const rosterSizeAllTime = toSeries(allBuckets, rosterAllTime);
  const scoutViewsWeekly = toSeries(recentBuckets, scoutWeekly);
  const scoutViewsAllTime = toSeries(allBuckets, scoutAllTime);

  const weeklySince =
    recentBuckets.length === allBuckets.length
      ? teamJoinedAt
      : (recentBuckets[0]?.start ?? teamJoinedAt);
  const allTimeSince = teamJoinedAt;

  const playerCount = members.filter((m) => m.role === "player").length;

  return {
    teamJoinedAt: teamJoinedAt.toISOString(),
    rosterCount: members.length,
    playerCount,
    pendingJoinRequests,
    pendingInvites: Number(pendingInvites[0]?.count ?? 0),
    watchlistCount: watchlistTotal,
    rosterSize: {
      weekly: rosterSizeWeekly,
      allTime: rosterSizeAllTime,
    },
    scoutViews: {
      weekly: scoutViewsWeekly,
      allTime: scoutViewsAllTime,
    },
    rosterSummary: {
      weekly: { newJoins: countSince(memberJoinDates, weeklySince) },
      allTime: { newJoins: countSince(memberJoinDates, allTimeSince) },
    },
    scoutSummary: {
      weekly: scoutSummaryForRange(
        viewDates,
        joinRequests,
        invites,
        invitesAccepted,
        weeklySince,
        scoutViewsWeekly,
      ),
      allTime: scoutSummaryForRange(
        viewDates,
        joinRequests,
        invites,
        invitesAccepted,
        allTimeSince,
        scoutViewsAllTime,
      ),
    },
  };
}
