/**
 * Scout watchlist + recruitment invites for team managers.
 * Run: npx tsx scripts/setup-watchlist-tables.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const statements = [
  `CREATE TABLE IF NOT EXISTS "PlayerWatchlist" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "addedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerWatchlist_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PlayerWatchlist_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerWatchlist_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerWatchlist_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PlayerWatchlist_teamId_playerProfileId_key" ON "PlayerWatchlist"("teamId", "playerProfileId")`,
  `CREATE INDEX IF NOT EXISTS "PlayerWatchlist_teamId_idx" ON "PlayerWatchlist"("teamId")`,
  `CREATE TABLE IF NOT EXISTS "PlayerRecruitmentInvite" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerRecruitmentInvite_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PlayerRecruitmentInvite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerRecruitmentInvite_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerRecruitmentInvite_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PlayerRecruitmentInvite_teamId_playerProfileId_key" ON "PlayerRecruitmentInvite"("teamId", "playerProfileId")`,
  `CREATE INDEX IF NOT EXISTS "PlayerRecruitmentInvite_playerProfileId_status_idx" ON "PlayerRecruitmentInvite"("playerProfileId", "status")`,
  `ALTER TABLE "PlayerRecruitmentInvite" ADD COLUMN IF NOT EXISTS "message" TEXT`,
];

async function main() {
  for (const sql of statements) {
    await db.$executeRawUnsafe(sql);
    console.log("OK:", sql.split("\n")[0].slice(0, 72));
  }
  console.log("Watchlist tables ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
