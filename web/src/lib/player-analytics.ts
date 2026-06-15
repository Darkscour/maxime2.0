import { db } from "@/lib/db";
import { clerkImageUrlMap } from "@/lib/clerk-avatars";
import {
  countProfileViews,
  fetchDistinctViewerTeams,
  fetchPlayTimeLogsSince,
  fetchProfileViewsSince,
  findRecentProfileView,
  insertPlayTimeLog,
  insertProfileView,
} from "@/lib/player-analytics-db";

export const ANALYTICS_WEEK_COUNT = 6;

export type PlayerAnalyticsSnapshot = {
  totalProfileViews: number;
  uniqueScoutTeams: number;
  activeWeeks: number;
  profileViewsTrend: number | null;
  weeklyProfileViews: number[];
  weeklyPlayTime: number[];
  weekLabels: string[];
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
  return startOfWeek(date).toISOString().slice(0, 10);
}

function buildWeekBuckets(count: number) {
  const now = new Date();
  const current = startOfWeek(now);
  const buckets: { key: string; label: string; start: Date }[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const start = new Date(current);
    start.setDate(start.getDate() - i * 7);
    const label =
      i === 0
        ? "Now"
        : start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    buckets.push({ key: weekKey(start), label, start });
  }

  return buckets;
}

function trendPercent(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function emptySnapshot(
  buckets: ReturnType<typeof buildWeekBuckets>,
  currentHoursPerWeek?: number | null,
): PlayerAnalyticsSnapshot {
  const weeklyPlayTime = buckets.map(() => 0);
  if (currentHoursPerWeek != null && currentHoursPerWeek > 0) {
    weeklyPlayTime[weeklyPlayTime.length - 1] = currentHoursPerWeek;
  }
  return {
    totalProfileViews: 0,
    uniqueScoutTeams: 0,
    activeWeeks: weeklyPlayTime.filter((h) => h > 0).length,
    profileViewsTrend: null,
    weeklyProfileViews: buckets.map(() => 0),
    weeklyPlayTime,
    weekLabels: buckets.map((b) => b.label),
  };
}

/** Aggregate analytics for a player's dashboard card. */
export async function getPlayerAnalytics(
  playerProfileId: string,
  currentHoursPerWeek?: number | null,
): Promise<PlayerAnalyticsSnapshot> {
  const buckets = buildWeekBuckets(ANALYTICS_WEEK_COUNT);
  const rangeStart = buckets[0]?.start ?? new Date();

  try {
  const [views, playLogs, uniqueTeams, totalProfileViews] = await Promise.all([
    fetchProfileViewsSince(playerProfileId, rangeStart),
    fetchPlayTimeLogsSince(playerProfileId, rangeStart),
    fetchDistinctViewerTeams(playerProfileId),
    countProfileViews(playerProfileId),
  ]);

  const viewsByWeek = new Map(buckets.map((b) => [b.key, 0]));
  for (const view of views) {
    const key = weekKey(view.createdAt);
    if (viewsByWeek.has(key)) {
      viewsByWeek.set(key, (viewsByWeek.get(key) ?? 0) + 1);
    }
  }

  const playByWeek = new Map(buckets.map((b) => [b.key, 0]));
  for (const log of playLogs) {
    const key = weekKey(log.createdAt);
    if (playByWeek.has(key)) {
      playByWeek.set(key, log.hoursPerWeek);
    }
  }

  const weeklyProfileViews = buckets.map((b) => viewsByWeek.get(b.key) ?? 0);
  const weeklyPlayTime = buckets.map((b) => playByWeek.get(b.key) ?? 0);

  if (
    playLogs.length === 0 &&
    currentHoursPerWeek != null &&
    currentHoursPerWeek > 0
  ) {
    weeklyPlayTime[weeklyPlayTime.length - 1] = currentHoursPerWeek;
  }

  const activeWeeks = weeklyPlayTime.filter((h) => h > 0).length;
  const uniqueScoutTeams = uniqueTeams.filter((v) => v.viewerTeamId != null).length;

  const profileViewsTrend = trendPercent(
    weeklyProfileViews[weeklyProfileViews.length - 1] ?? 0,
    weeklyProfileViews[weeklyProfileViews.length - 2] ?? 0,
  );

  return {
    totalProfileViews,
    uniqueScoutTeams,
    activeWeeks,
    profileViewsTrend,
    weeklyProfileViews,
    weeklyPlayTime,
    weekLabels: buckets.map((b) => b.label),
  };
  } catch (e) {
    console.error("[player-analytics]", e);
    return emptySnapshot(buckets, currentHoursPerWeek);
  }
}

/** Record a profile view from a scout / team manager (skips self-views). */
export async function recordPlayerProfileView(input: {
  playerProfileId: string;
  viewerUserId: string;
  viewerTeamId?: string | null;
  playerOwnerUserId: string;
}) {
  if (input.viewerUserId === input.playerOwnerUserId) {
    return null;
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await findRecentProfileView({
    playerProfileId: input.playerProfileId,
    viewerUserId: input.viewerUserId,
    since: oneHourAgo,
  });
  if (recent) return recent;

  const view = await insertProfileView({
    playerProfileId: input.playerProfileId,
    viewerUserId: input.viewerUserId,
    viewerTeamId: input.viewerTeamId ?? null,
  });

  try {
    const { createNotification } = await import("@/lib/notifications-db");
    await createNotification({
      userId: input.playerOwnerUserId,
      type: "analytics",
      title: "New profile view",
      body: "A team manager viewed your scout profile.",
      href: "/dashboard",
    });
  } catch {
    // notifications table may not exist yet
  }

  return view;
}

/** Log a play-time snapshot when the player updates hours. */
export async function logPlayerPlayTime(input: {
  playerProfileId: string;
  hoursPerWeek: number;
}) {
  return insertPlayTimeLog(input);
}

export type ScoutPlayerListing = {
  id: string;
  handle: string;
  game: string;
  role: string;
  rank: string;
  region: string;
  school: string | null;
  status: string;
  tags: string[];
  hoursPerWeek: number | null;
  imageUrl: string | null;
};


/** Players visible to team managers scouting talent. */
export async function listScoutablePlayers(): Promise<ScoutPlayerListing[]> {
  const profiles = await db.playerProfile.findMany({
    orderBy: { handle: "asc" },
    select: {
      id: true,
      handle: true,
      game: true,
      role: true,
      rank: true,
      region: true,
      school: true,
      status: true,
      tags: true,
      hoursPerWeek: true,
      user: { select: { clerkId: true } },
    },
  });

  const imageByClerkId = await clerkImageUrlMap(
    profiles.map((profile) => profile.user.clerkId),
  );

  return profiles.map(({ user, ...profile }) => ({
    ...profile,
    imageUrl: imageByClerkId.get(user.clerkId) ?? null,
  }));
}

export async function getScoutPlayerProfile(handle: string) {
  return db.playerProfile.findUnique({
    where: { handle },
    include: {
      user: { select: { id: true, displayName: true } },
    },
  });
}
