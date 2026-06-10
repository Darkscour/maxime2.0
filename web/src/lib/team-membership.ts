import { db } from "@/lib/db";
import { removeFromWatchlist } from "@/lib/player-watchlist-db";

/** Remove a player from their current team (keeps player profile). */
export async function leaveCurrentTeam(userId: string) {
  const membership = await db.teamMembership.findUnique({
    where: { userId },
    include: { team: true },
  });

  if (!membership) {
    return { left: false as const, reason: "NO_TEAM" as const };
  }

  if (membership.role === "captain" || membership.role === "manager") {
    const otherMembers = await db.teamMembership.count({
      where: {
        teamId: membership.teamId,
        userId: { not: userId },
        status: "active",
      },
    });

    if (otherMembers > 0) {
      return { left: false as const, reason: "MANAGER_HAS_ROSTER" as const };
    }
  }

  await db.teamMembership.delete({ where: { userId } });

  return {
    left: true as const,
    teamName: membership.team.name,
  };
}

/** Join a team by internal team id (used when accepting a recruitment invite). */
export async function joinTeamAsPlayer(userId: string, teamId: string) {
  const existing = await db.teamMembership.findUnique({ where: { userId } });
  if (existing) {
    if (existing.teamId === teamId) {
      return { ok: true as const, alreadyMember: true as const };
    }
    return { ok: false as const, reason: "ALREADY_ON_TEAM" as const };
  }

  await db.$transaction([
    db.teamMembership.create({
      data: {
        teamId,
        userId,
        role: "player",
        status: "active",
      },
    }),
    db.userAccount.update({
      where: { id: userId },
      data: { accountType: "player", onboardingComplete: true },
    }),
  ]);

  const profile = await db.playerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (profile) {
    await removeFromWatchlist(teamId, profile.id);
  }

  return { ok: true as const, alreadyMember: false as const };
}
