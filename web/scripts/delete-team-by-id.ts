/**
 * Deletes a team by id.
 * Run: npx tsx scripts/delete-team-by-id.ts <team-id>
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const teamId = process.argv[2]?.trim();
  if (!teamId) {
    console.error("Usage: npx tsx scripts/delete-team-by-id.ts <team-id>");
    process.exit(1);
  }

  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) {
    console.log(`No team found with id ${teamId}.`);
    return;
  }

  console.log(`Deleting team "${team.name}" (${team.id})…`);
  await db.team.delete({ where: { id: teamId } });
  console.log("Team deleted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
