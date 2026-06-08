/**
 * Deletes a Maxime platform account (and related team data) by email.
 * Clerk identity is unchanged — only Supabase/Prisma rows are removed.
 *
 * Run: npx tsx scripts/delete-user-by-email.ts sahithg1@terpmail.umd.edu
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function deleteSponsorLeadsForTeam(teamId: string): Promise<number> {
  if (
    typeof (db as { sponsorLead?: { deleteMany: (args: object) => Promise<{ count: number }> } })
      .sponsorLead !== "undefined"
  ) {
    const result = await db.sponsorLead.deleteMany({ where: { teamId } });
    return result.count;
  }
  return Number(
    await db.$executeRaw`DELETE FROM "SponsorLead" WHERE "teamId" = ${teamId}`,
  );
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx scripts/delete-user-by-email.ts <email>");
    process.exit(1);
  }

  const account = await db.userAccount.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { membership: true, playerProfile: true },
  });

  if (!account) {
    console.log(`No UserAccount found for ${email}.`);
    console.log("If you still land on the dashboard, sign out and try again.");
    return;
  }

  console.log(`Deleting Maxime data for ${email}…\n`);
  console.log(`  UserAccount id: ${account.id}`);
  console.log(`  clerkId:        ${account.clerkId}`);
  if (account.playerProfile) {
    console.log(`  PlayerProfile:  ${account.playerProfile.handle}`);
  }
  if (account.membership) {
    console.log(`  TeamMembership: ${account.membership.teamId} (${account.membership.role})`);
  }

  const teamId = account.membership?.teamId;

  if (teamId) {
    const deletedLeads = await deleteSponsorLeadsForTeam(teamId);
    console.log(`\n  SponsorLead rows deleted: ${deletedLeads}`);

    const otherMembers = await db.teamMembership.count({
      where: { teamId, userId: { not: account.id }, status: "active" },
    });

    if (otherMembers === 0) {
      await db.teamMembership.deleteMany({ where: { teamId } });
      await db.team.delete({ where: { id: teamId } });
      console.log(`  Team ${teamId} deleted (no other active members).`);
    } else {
      console.log(`  Team ${teamId} kept (${otherMembers} other member(s)).`);
    }
  }

  await db.userAccount.delete({ where: { id: account.id } });
  console.log(`\nUserAccount deleted. Clerk sign-in for ${email} is unchanged.`);
  console.log("Sign out, click Get started, and complete onboarding to test again.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
