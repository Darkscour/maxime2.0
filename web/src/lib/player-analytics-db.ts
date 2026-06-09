import { randomUUID } from "crypto";
import { db } from "@/lib/db";

type ViewRow = {
  createdAt: Date;
  viewerTeamId: string | null;
};

type PlayLogRow = {
  createdAt: Date;
  hoursPerWeek: number;
};

/** Raw SQL access — works even when Prisma client hasn't been regenerated yet. */
export async function fetchProfileViewsSince(
  playerProfileId: string,
  since: Date,
): Promise<ViewRow[]> {
  return db.$queryRaw<ViewRow[]>`
    SELECT "createdAt", "viewerTeamId"
    FROM "PlayerProfileView"
    WHERE "playerProfileId" = ${playerProfileId}
      AND "createdAt" >= ${since}
  `;
}

export async function fetchDistinctViewerTeams(
  playerProfileId: string,
): Promise<{ viewerTeamId: string | null }[]> {
  return db.$queryRaw<{ viewerTeamId: string | null }[]>`
    SELECT DISTINCT "viewerTeamId"
    FROM "PlayerProfileView"
    WHERE "playerProfileId" = ${playerProfileId}
  `;
}

export async function countProfileViews(playerProfileId: string): Promise<number> {
  const rows = await db.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count
    FROM "PlayerProfileView"
    WHERE "playerProfileId" = ${playerProfileId}
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function fetchPlayTimeLogsSince(
  playerProfileId: string,
  since: Date,
): Promise<PlayLogRow[]> {
  return db.$queryRaw<PlayLogRow[]>`
    SELECT "createdAt", "hoursPerWeek"
    FROM "PlayerPlayTimeLog"
    WHERE "playerProfileId" = ${playerProfileId}
      AND "createdAt" >= ${since}
    ORDER BY "createdAt" ASC
  `;
}

export async function findRecentProfileView(input: {
  playerProfileId: string;
  viewerUserId: string;
  since: Date;
}): Promise<{ id: string } | null> {
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT "id"
    FROM "PlayerProfileView"
    WHERE "playerProfileId" = ${input.playerProfileId}
      AND "viewerUserId" = ${input.viewerUserId}
      AND "createdAt" >= ${input.since}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function insertProfileView(input: {
  playerProfileId: string;
  viewerUserId: string;
  viewerTeamId: string | null;
}): Promise<{ id: string }> {
  const id = randomUUID();
  await db.$executeRaw`
    INSERT INTO "PlayerProfileView" ("id", "playerProfileId", "viewerUserId", "viewerTeamId", "createdAt")
    VALUES (${id}, ${input.playerProfileId}, ${input.viewerUserId}, ${input.viewerTeamId}, NOW())
  `;
  return { id };
}

export async function insertPlayTimeLog(input: {
  playerProfileId: string;
  hoursPerWeek: number;
}): Promise<void> {
  const id = randomUUID();
  await db.$executeRaw`
    INSERT INTO "PlayerPlayTimeLog" ("id", "playerProfileId", "hoursPerWeek", "createdAt")
    VALUES (${id}, ${input.playerProfileId}, ${input.hoursPerWeek}, NOW())
  `;
}
