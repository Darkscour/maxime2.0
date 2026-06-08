/**
 * Creates SponsorLead table for team sponsorship pipeline.
 * Run: npm run db:sponsor-leads
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const statements = [
  `CREATE TABLE IF NOT EXISTS "SponsorLead" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "sponsorName" TEXT NOT NULL,
    "industry" TEXT,
    "difficulty" TEXT,
    "sponsorLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'saved',
    "fitScore" INTEGER,
    "fitReason" TEXT,
    "notes" TEXT,
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SponsorLead_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SponsorLead_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "SponsorLead_teamId_sponsorId_key" ON "SponsorLead"("teamId", "sponsorId")`,
  `CREATE INDEX IF NOT EXISTS "SponsorLead_teamId_idx" ON "SponsorLead"("teamId")`,
  `CREATE INDEX IF NOT EXISTS "SponsorLead_status_idx" ON "SponsorLead"("status")`,
];

async function main() {
  for (let i = 0; i < statements.length; i++) {
    await db.$executeRawUnsafe(statements[i]);
    console.log(`[${i + 1}/${statements.length}] OK`);
  }
  console.log("\nSponsorLead table ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
