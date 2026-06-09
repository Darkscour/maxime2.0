/**
 * Deletes a team owned by a manager account (by email).
 * Run: npx tsx scripts/delete-team-by-manager-email.ts sahithg@sis.edu.in
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx scripts/delete-team-by-manager-email.ts <manager-email>");
    process.exit(1);
  }

  const account = await db.userAccount.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { membership: { include: { team: true } } },
  });

  if (!account?.membership?.team) {
    console.log(`No team membership found for ${email}.`);
    return;
  }

  const team = account.membership.team;
  console.log(`Deleting team "${team.name}" (${team.id}) for ${email}…`);

  await db.team.delete({ where: { id: team.id } });
  console.log("Team deleted (memberships and related rows cascade).");

  await db.userAccount.update({
    where: { id: account.id },
    data: { onboardingComplete: false },
  });
  console.log("Manager account kept; onboarding flag reset so they can re-onboard.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
