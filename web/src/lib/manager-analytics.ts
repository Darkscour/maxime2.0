import { db } from "@/lib/db";
import { findLeadsByTeamId } from "@/lib/sponsor-lead-store";
import { watchlistCount } from "@/lib/player-watchlist-db";
import { ANALYTICS_WEEK_COUNT } from "@/lib/player-analytics";

export type ManagerOrgAnalytics = {
  rosterCount: number;
  playerCount: number;
  pendingInvites: number;
  watchlistCount: number;
  sponsorLeads: number;
  invitesAccepted: number;
  scoutProfileViews: number;
  recentJoins: number;
  weeklyRosterJoins: number[];
  weekLabels: string[];
  rosterTrend: number | null;
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

export async function getManagerOrgAnalytics(
  teamId: string,
): Promise<ManagerOrgAnalytics> {
  const buckets = buildWeekBuckets(ANALYTICS_WEEK_COUNT);
  const rangeStart = buckets[0]?.start ?? new Date();

  const [
    members,
    pendingInvites,
    acceptedInvites,
    watchlistTotal,
    sponsorLeads,
    scoutViews,
  ] = await Promise.all([
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
    watchlistCount(teamId),
    findLeadsByTeamId(teamId),
    db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "PlayerProfileView"
      WHERE "viewerTeamId" = ${teamId} AND "createdAt" >= ${rangeStart}
    `.catch(() => [{ count: BigInt(0) }]),
  ]);

  const joinsByWeek = new Map(buckets.map((b) => [b.key, 0]));
  for (const member of members) {
    const key = weekKey(member.createdAt);
    if (joinsByWeek.has(key)) {
      joinsByWeek.set(key, (joinsByWeek.get(key) ?? 0) + 1);
    }
  }

  const weeklyRosterJoins = buckets.map((b) => joinsByWeek.get(b.key) ?? 0);
  const recentJoins = members.filter((m) => m.createdAt >= rangeStart).length;
  const playerCount = members.filter((m) => m.role === "player").length;

  const rosterTrend = trendPercent(
    weeklyRosterJoins[weeklyRosterJoins.length - 1] ?? 0,
    weeklyRosterJoins[weeklyRosterJoins.length - 2] ?? 0,
  );

  return {
    rosterCount: members.length,
    playerCount,
    pendingInvites: Number(pendingInvites[0]?.count ?? 0),
    watchlistCount: watchlistTotal,
    sponsorLeads: sponsorLeads.length,
    invitesAccepted: Number(acceptedInvites[0]?.count ?? 0),
    scoutProfileViews: Number(scoutViews[0]?.count ?? 0),
    recentJoins,
    weeklyRosterJoins,
    weekLabels: buckets.map((b) => b.label),
    rosterTrend,
  };
}
