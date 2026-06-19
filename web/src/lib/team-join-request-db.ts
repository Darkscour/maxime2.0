import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { clerkImageUrlMap } from "@/lib/clerk-avatars";
import {
  canManagerRecruitPlayer,
  canPlayerJoinTeam,
  type TeamAudienceContext,
} from "@/lib/audience-guards";

const CREATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS "TeamJoinRequest" (
  "id" TEXT NOT NULL,
  "teamId" TEXT NOT NULL,
  "playerProfileId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TeamJoinRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TeamJoinRequest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TeamJoinRequest_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
)`;

function isMissingJoinRequestTable(e: unknown): boolean {
  const msg =
    e && typeof e === "object" && "message" in e
      ? String((e as { message: unknown }).message)
      : "";
  return msg.includes("TeamJoinRequest") && msg.includes("does not exist");
}

async function ensureJoinRequestTable() {
  await db.$executeRawUnsafe(CREATE_TABLE_SQL);
  await db.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "TeamJoinRequest_teamId_playerProfileId_key" ON "TeamJoinRequest"("teamId", "playerProfileId")`,
  );
}

async function withJoinRequestSchema<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (!isMissingJoinRequestTable(e)) throw e;
    await ensureJoinRequestTable();
    return fn();
  }
}

export async function fetchPendingJoinRequestTeamIds(
  playerProfileId: string,
): Promise<string[]> {
  return withJoinRequestSchema(async () => {
    const rows = await db.$queryRaw<{ teamId: string }[]>`
      SELECT "teamId"
      FROM "TeamJoinRequest"
      WHERE "playerProfileId" = ${playerProfileId}
        AND "status" = 'pending'
    `;
    return rows.map((row) => row.teamId);
  });
}

export async function fetchPendingJoinRequestPlayerIdsForTeam(
  teamId: string,
  managerTeam?: TeamAudienceContext,
): Promise<string[]> {
  const rows = await fetchPendingJoinRequestsForTeam(teamId, managerTeam);
  return rows.map((row) => row.playerProfileId);
}

export type TeamJoinRequestRow = {
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
  requestedAt: Date;
  clerkId: string;
  playerAccountTier: string | null;
  playerInstitutionId: string | null;
};

export type TeamJoinRequestListing = TeamJoinRequestRow & {
  imageUrl: string | null;
};

export async function fetchPendingJoinRequestsForTeam(
  teamId: string,
  managerTeam?: TeamAudienceContext,
): Promise<TeamJoinRequestRow[]> {
  const rows = await withJoinRequestSchema(() =>
    db.$queryRaw<TeamJoinRequestRow[]>`
      SELECT
        j."id",
        j."playerProfileId",
        p."handle",
        p."game",
        p."role",
        p."rank",
        p."region",
        p."school",
        p."status",
        p."tags",
        j."createdAt" AS "requestedAt",
        u."clerkId",
        p."accountTier" AS "playerAccountTier",
        p."institutionId" AS "playerInstitutionId"
      FROM "TeamJoinRequest" j
      JOIN "PlayerProfile" p ON p."id" = j."playerProfileId"
      JOIN "UserAccount" u ON u."id" = p."userId"
      WHERE j."teamId" = ${teamId}
        AND j."status" = 'pending'
      ORDER BY j."createdAt" DESC
    `,
  );

  if (!managerTeam) return rows;

  return rows.filter((row) =>
    canManagerRecruitPlayer(managerTeam, {
      accountTier: row.playerAccountTier,
      institutionId: row.playerInstitutionId,
    }),
  );
}

export async function fetchPendingJoinRequestsWithAvatars(
  teamId: string,
  managerTeam?: TeamAudienceContext,
): Promise<TeamJoinRequestListing[]> {
  const requests = await fetchPendingJoinRequestsForTeam(teamId, managerTeam);
  const imageByClerkId = await clerkImageUrlMap(requests.map((r) => r.clerkId));
  return requests.map((request) => ({
    ...request,
    imageUrl: imageByClerkId.get(request.clerkId) ?? null,
  }));
}

export async function countPendingJoinRequestsForTeam(teamId: string): Promise<number> {
  return withJoinRequestSchema(async () => {
    const rows = await db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "TeamJoinRequest"
      WHERE "teamId" = ${teamId} AND "status" = 'pending'
    `;
    return Number(rows[0]?.count ?? 0);
  });
}

export async function dismissJoinRequest(teamId: string, playerProfileId: string) {
  return withJoinRequestSchema(async () => {
    await db.$executeRaw`
      UPDATE "TeamJoinRequest"
      SET "status" = 'dismissed', "updatedAt" = NOW()
      WHERE "teamId" = ${teamId}
        AND "playerProfileId" = ${playerProfileId}
        AND "status" = 'pending'
    `;
  });
}

/** Clear pending request after manager sends a recruitment invite. */
export async function fulfillJoinRequest(teamId: string, playerProfileId: string) {
  return withJoinRequestSchema(async () => {
    await db.$executeRaw`
      UPDATE "TeamJoinRequest"
      SET "status" = 'fulfilled', "updatedAt" = NOW()
      WHERE "teamId" = ${teamId}
        AND "playerProfileId" = ${playerProfileId}
        AND "status" = 'pending'
    `;
  });
}

export async function hasPendingJoinRequest(
  teamId: string,
  playerProfileId: string,
): Promise<boolean> {
  return withJoinRequestSchema(async () => {
    const rows = await db.$queryRaw<{ id: string }[]>`
      SELECT "id"
      FROM "TeamJoinRequest"
      WHERE "teamId" = ${teamId}
        AND "playerProfileId" = ${playerProfileId}
        AND "status" = 'pending'
      LIMIT 1
    `;
    return rows.length > 0;
  });
}

export async function createTeamJoinRequest(input: {
  teamId: string;
  playerProfileId: string;
}) {
  return withJoinRequestSchema(async () => {
    const existing = await db.$queryRaw<{ id: string; status: string }[]>`
      SELECT "id", "status"
      FROM "TeamJoinRequest"
      WHERE "teamId" = ${input.teamId}
        AND "playerProfileId" = ${input.playerProfileId}
      LIMIT 1
    `;

    if (existing[0]?.status === "pending") {
      return { id: existing[0].id, alreadyPending: true };
    }

    if (existing[0]) {
      await db.$executeRaw`
        UPDATE "TeamJoinRequest"
        SET "status" = 'pending', "updatedAt" = NOW()
        WHERE "id" = ${existing[0].id}
      `;
      return { id: existing[0].id, alreadyPending: false };
    }

    const id = randomUUID();
    await db.$executeRaw`
      INSERT INTO "TeamJoinRequest" ("id", "teamId", "playerProfileId", "status", "createdAt", "updatedAt")
      VALUES (${id}, ${input.teamId}, ${input.playerProfileId}, 'pending', NOW(), NOW())
    `;
    return { id, alreadyPending: false };
  });
}

export async function fetchTeamManagerUserIds(teamId: string): Promise<string[]> {
  const rows = await db.teamMembership.findMany({
    where: {
      teamId,
      status: "active",
      role: { in: ["captain", "manager"] },
    },
    select: { userId: true },
  });
  return rows.map((row) => row.userId);
}
