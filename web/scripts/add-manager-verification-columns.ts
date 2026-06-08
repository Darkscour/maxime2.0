/**
 * Adds manager verification columns to UserAccount.
 * Run: npx tsx scripts/add-manager-verification-columns.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const statements = [
  `ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "managerTitle" TEXT`,
  `ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "managerOrgEmail" TEXT`,
  `ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "managerVerificationStatus" TEXT`,
];

async function main() {
  for (const sql of statements) {
    await db.$executeRawUnsafe(sql);
    console.log("OK:", sql.slice(0, 60) + "…");
  }
  console.log("\nManager verification columns ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
