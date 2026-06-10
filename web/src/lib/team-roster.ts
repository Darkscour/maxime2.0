import { db } from "@/lib/db";

export type RosterMember = {
  membershipId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  email: string | null;
  displayName: string | null;
  handle: string | null;
  game: string | null;
  roleInGame: string | null;
  rank: string | null;
  hoursPerWeek: number | null;
  playerProfileId: string | null;
};

export async function fetchTeamRoster(teamId: string): Promise<RosterMember[]> {
  const rows = await db.teamMembership.findMany({
    where: { teamId, status: "active" },
    include: {
      user: {
        select: {
          email: true,
          displayName: true,
          playerProfile: {
            select: {
              id: true,
              handle: true,
              game: true,
              role: true,
              rank: true,
              hoursPerWeek: true,
            },
          },
        },
      },
    },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  return rows.map((row) => ({
    membershipId: row.id,
    userId: row.userId,
    role: row.role,
    joinedAt: row.createdAt,
    email: row.user.email,
    displayName: row.user.displayName,
    handle: row.user.playerProfile?.handle ?? null,
    game: row.user.playerProfile?.game ?? null,
    roleInGame: row.user.playerProfile?.role ?? null,
    rank: row.user.playerProfile?.rank ?? null,
    hoursPerWeek: row.user.playerProfile?.hoursPerWeek ?? null,
    playerProfileId: row.user.playerProfile?.id ?? null,
  }));
}

/** Manager/captain removes a player from the roster. */
export async function removePlayerFromRoster(teamId: string, playerUserId: string) {
  const membership = await db.teamMembership.findUnique({
    where: { userId: playerUserId },
    include: { user: { include: { playerProfile: true } } },
  });

  if (!membership || membership.teamId !== teamId) {
    return { ok: false as const, reason: "NOT_ON_TEAM" as const };
  }

  if (membership.role !== "player") {
    return { ok: false as const, reason: "NOT_A_PLAYER" as const };
  }

  await db.teamMembership.delete({ where: { userId: playerUserId } });

  return {
    ok: true as const,
    handle: membership.user.playerProfile?.handle ?? membership.user.displayName ?? "Player",
  };
}
