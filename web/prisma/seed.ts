/**
 * Seed script — populates the database with starter mock data.
 *
 * Run:  npx prisma db seed
 *
 * Safe to re-run: uses `skipDuplicates` so existing rows are kept untouched.
 * Replace this with real data flows (PandaScore sync, admin form inputs)
 * once those are wired up.
 */

import { PrismaClient, Prisma } from "@prisma/client";
import { PLAYERS, SPONSORS } from "../src/lib/mock-data";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const playerResult = await db.player.createMany({
    data: PLAYERS as Prisma.PlayerCreateManyInput[],
    skipDuplicates: true,
  });

  const sponsorResult = await db.sponsor.createMany({
    data: SPONSORS as Prisma.SponsorCreateManyInput[],
    skipDuplicates: true,
  });

  const [totalPlayers, totalSponsors] = await Promise.all([
    db.player.count(),
    db.sponsor.count(),
  ]);

  console.log(`+ inserted ${playerResult.count} new players`);
  console.log(`+ inserted ${sponsorResult.count} new sponsors`);
  console.log(
    `Database now contains ${totalPlayers} players and ${totalSponsors} sponsors.`,
  );
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
