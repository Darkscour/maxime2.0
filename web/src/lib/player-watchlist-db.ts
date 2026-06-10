import { randomUUID } from "crypto";
import { db } from "@/lib/db";

function isMissingInviteMessageColumn(e: unknown): boolean {
  const msg =
    e && typeof e === "object" && "message" in e
      ? String((e as { message: unknown }).message)
      : "";
  return msg.includes("message") && msg.includes("does not exist");
}

async function ensureInviteMessageColumn() {
  await db.$executeRawUnsafe(
    `ALTER TABLE "PlayerRecruitmentInvite" ADD COLUMN IF NOT EXISTS "message" TEXT`,
  );
}

async function withInviteMessageSchema<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (!isMissingInviteMessageColumn(e)) throw e;
    await ensureInviteMessageColumn();
    return fn();
  }
}

export type WatchlistRow = {
  id: string;
  playerProfileId: string;
  handle: string;
  game: string;
  role: string;
  rank: string;
  region: string;
  school: string | null;
  status: string;
  tags: string[];
  hoursPerWeek: number | null;
  addedAt: Date;
  inviteStatus: string | null;
};

export async function fetchTeamWatchlist(teamId: string): Promise<WatchlistRow[]> {
  await pruneWatchlistForRosterMembers(teamId);

  return db.$queryRaw<WatchlistRow[]>`
    SELECT
      w."id",
      p."id" AS "playerProfileId",
      p."handle",
      p."game",
      p."role",
      p."rank",
      p."region",
      p."school",
      p."status",
      p."tags",
      p."hoursPerWeek",
      w."createdAt" AS "addedAt",
      i."status" AS "inviteStatus"
    FROM "PlayerWatchlist" w
    JOIN "PlayerProfile" p ON p."id" = w."playerProfileId"
    LEFT JOIN "PlayerRecruitmentInvite" i
      ON i."teamId" = w."teamId" AND i."playerProfileId" = w."playerProfileId"
    WHERE w."teamId" = ${teamId}
      AND NOT EXISTS (
        SELECT 1 FROM "TeamMembership" tm
        WHERE tm."userId" = p."userId"
          AND tm."teamId" = w."teamId"
          AND tm."status" = 'active'
      )
    ORDER BY w."createdAt" DESC
  `;
}

export async function isOnWatchlist(
  teamId: string,
  playerProfileId: string,
): Promise<boolean> {
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "PlayerWatchlist"
    WHERE "teamId" = ${teamId} AND "playerProfileId" = ${playerProfileId}
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function addToWatchlist(input: {
  teamId: string;
  playerProfileId: string;
  addedByUserId: string;
}) {
  const existing = await isOnWatchlist(input.teamId, input.playerProfileId);
  if (existing) return { id: "existing" };

  const id = randomUUID();
  await db.$executeRaw`
    INSERT INTO "PlayerWatchlist" ("id", "teamId", "playerProfileId", "addedByUserId", "createdAt")
    VALUES (${id}, ${input.teamId}, ${input.playerProfileId}, ${input.addedByUserId}, NOW())
  `;
  return { id };
}

export async function removeFromWatchlist(teamId: string, playerProfileId: string) {
  await db.$executeRaw`
    DELETE FROM "PlayerWatchlist"
    WHERE "teamId" = ${teamId} AND "playerProfileId" = ${playerProfileId}
  `;
}

/** Drop watchlist rows for anyone already on the team roster. */
export async function pruneWatchlistForRosterMembers(teamId: string) {
  await db.$executeRaw`
    DELETE FROM "PlayerWatchlist" w
    WHERE w."teamId" = ${teamId}
    AND EXISTS (
      SELECT 1 FROM "PlayerProfile" p
      JOIN "TeamMembership" tm ON tm."userId" = p."userId"
      WHERE p."id" = w."playerProfileId"
        AND tm."teamId" = w."teamId"
        AND tm."status" = 'active'
    )
  `;
}

export async function isPlayerOnTeam(
  teamId: string,
  playerProfileId: string,
): Promise<boolean> {
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT tm."id"
    FROM "PlayerProfile" p
    JOIN "TeamMembership" tm ON tm."userId" = p."userId"
    WHERE p."id" = ${playerProfileId}
      AND tm."teamId" = ${teamId}
      AND tm."status" = 'active'
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function sendRecruitmentInvite(input: {
  teamId: string;
  playerProfileId: string;
  invitedByUserId: string;
  message?: string | null;
}) {
  return withInviteMessageSchema(async () => {
  const existing = await db.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "PlayerRecruitmentInvite"
    WHERE "teamId" = ${input.teamId} AND "playerProfileId" = ${input.playerProfileId}
    LIMIT 1
  `;

  const message = input.message?.trim() || null;

  if (existing[0]) {
    await db.$executeRaw`
      UPDATE "PlayerRecruitmentInvite"
      SET "status" = 'pending', "updatedAt" = NOW(), "invitedByUserId" = ${input.invitedByUserId}, "message" = ${message}
      WHERE "id" = ${existing[0].id}
    `;
    return { id: existing[0].id };
  }

  const id = randomUUID();
  await db.$executeRaw`
    INSERT INTO "PlayerRecruitmentInvite" ("id", "teamId", "playerProfileId", "invitedByUserId", "status", "message", "createdAt", "updatedAt")
    VALUES (${id}, ${input.teamId}, ${input.playerProfileId}, ${input.invitedByUserId}, 'pending', ${message}, NOW(), NOW())
  `;
  return { id };
  });
}

export type PendingInviteRow = {
  id: string;
  teamName: string;
  teamId: string;
  inviteCode: string;
  message: string | null;
  invitedAt: Date;
};

export type InviteDetailRow = PendingInviteRow & {
  playerProfileId: string;
  playerUserId: string;
  invitedByUserId: string;
  status: string;
};

export async function fetchPendingInvitesForPlayer(
  playerProfileId: string,
): Promise<PendingInviteRow[]> {
  return withInviteMessageSchema(() => db.$queryRaw<PendingInviteRow[]>`
    SELECT
      i."id",
      t."name" AS "teamName",
      t."id" AS "teamId",
      t."inviteCode",
      i."message",
      i."createdAt" AS "invitedAt"
    FROM "PlayerRecruitmentInvite" i
    JOIN "Team" t ON t."id" = i."teamId"
    WHERE i."playerProfileId" = ${playerProfileId}
      AND i."status" = 'pending'
    ORDER BY i."createdAt" DESC
  `);
}

export async function getInviteById(inviteId: string): Promise<InviteDetailRow | null> {
  return withInviteMessageSchema(async () => {
  const rows = await db.$queryRaw<InviteDetailRow[]>`
    SELECT
      i."id",
      i."status",
      i."message",
      i."invitedByUserId",
      i."playerProfileId",
      p."userId" AS "playerUserId",
      t."name" AS "teamName",
      t."id" AS "teamId",
      t."inviteCode",
      i."createdAt" AS "invitedAt"
    FROM "PlayerRecruitmentInvite" i
    JOIN "PlayerProfile" p ON p."id" = i."playerProfileId"
    JOIN "Team" t ON t."id" = i."teamId"
    WHERE i."id" = ${inviteId}
    LIMIT 1
  `;
  return rows[0] ?? null;
  });
}

export async function updateInviteStatus(inviteId: string, status: string) {
  await db.$executeRaw`
    UPDATE "PlayerRecruitmentInvite"
    SET "status" = ${status}, "updatedAt" = NOW()
    WHERE "id" = ${inviteId}
  `;
}

export async function watchlistCount(teamId: string): Promise<number> {
  const rows = await db.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count FROM "PlayerWatchlist" WHERE "teamId" = ${teamId}
  `;
  return Number(rows[0]?.count ?? 0);
}
