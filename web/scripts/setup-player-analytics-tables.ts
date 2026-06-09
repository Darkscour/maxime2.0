/**
 * Creates player analytics tables (profile views + play time logs).
 * Run: npx tsx scripts/setup-player-analytics-tables.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const statements = [
  `CREATE TABLE IF NOT EXISTS "PlayerProfileView" (
    "id" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "viewerUserId" TEXT NOT NULL,
    "viewerTeamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerProfileView_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PlayerProfileView_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerProfileView_viewerUserId_fkey" FOREIGN KEY ("viewerUserId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerProfileView_viewerTeamId_fkey" FOREIGN KEY ("viewerTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "PlayerProfileView_playerProfileId_createdAt_idx" ON "PlayerProfileView"("playerProfileId", "createdAt")`,
  `CREATE INDEX IF NOT EXISTS "PlayerProfileView_viewerUserId_idx" ON "PlayerProfileView"("viewerUserId")`,
  `CREATE INDEX IF NOT EXISTS "PlayerProfileView_viewerTeamId_idx" ON "PlayerProfileView"("viewerTeamId")`,
  `CREATE TABLE IF NOT EXISTS "PlayerPlayTimeLog" (
    "id" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "hoursPerWeek" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerPlayTimeLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PlayerPlayTimeLog_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "PlayerPlayTimeLog_playerProfileId_createdAt_idx" ON "PlayerPlayTimeLog"("playerProfileId", "createdAt")`,
];

async function main() {
  for (const sql of statements) {
    await db.$executeRawUnsafe(sql);
    console.log("OK:", sql.split("\n")[0].slice(0, 80));
  }
  console.log("Player analytics tables ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
