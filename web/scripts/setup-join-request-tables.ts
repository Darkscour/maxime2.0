/**
 * Player-initiated join requests to teams.
 * Run: npm run db:join-requests
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const statements = [
  `CREATE TABLE IF NOT EXISTS "TeamJoinRequest" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeamJoinRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TeamJoinRequest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamJoinRequest_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "TeamJoinRequest_teamId_playerProfileId_key" ON "TeamJoinRequest"("teamId", "playerProfileId")`,
  `CREATE INDEX IF NOT EXISTS "TeamJoinRequest_teamId_status_idx" ON "TeamJoinRequest"("teamId", "status")`,
  `CREATE INDEX IF NOT EXISTS "TeamJoinRequest_playerProfileId_status_idx" ON "TeamJoinRequest"("playerProfileId", "status")`,
];

async function main() {
  for (const sql of statements) {
    await db.$executeRawUnsafe(sql);
    console.log("OK:", sql.split("\n")[0].slice(0, 72));
  }
  console.log("Join request tables ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
