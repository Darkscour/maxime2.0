/**
 * Notifications + invite message column.
 * Run: npx tsx scripts/setup-notifications-tables.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const statements = [
  `CREATE TABLE IF NOT EXISTS "UserNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "UserNotification_userId_read_createdAt_idx" ON "UserNotification"("userId", "read", "createdAt")`,
  `ALTER TABLE "PlayerRecruitmentInvite" ADD COLUMN IF NOT EXISTS "message" TEXT`,
];

async function main() {
  for (const sql of statements) {
    await db.$executeRawUnsafe(sql);
    console.log("OK:", sql.slice(0, 70));
  }
  console.log("Notifications schema ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
