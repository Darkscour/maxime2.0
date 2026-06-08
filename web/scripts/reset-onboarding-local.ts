/**
 * Clears all onboarding data from Supabase — LOCAL DEV ONLY.
 * Run: npm run db:reset-onboarding
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function deleteSponsorLeads(): Promise<number> {
  if (typeof (db as { sponsorLead?: { deleteMany: () => Promise<{ count: number }> } }).sponsorLead !== "undefined") {
    const result = await db.sponsorLead.deleteMany();
    return result.count;
  }
  return Number(await db.$executeRaw`DELETE FROM "SponsorLead"`);
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to reset onboarding in production.");
    process.exit(1);
  }

  if (process.env.VERCEL === "1") {
    console.error("Refusing to reset onboarding on Vercel.");
    process.exit(1);
  }

  console.log("Resetting onboarding tables (local dev only)…\n");

  const deletedLeads = await deleteSponsorLeads();
  const deletedMemberships = await db.teamMembership.deleteMany();
  const deletedProfiles = await db.playerProfile.deleteMany();
  const deletedAccounts = await db.userAccount.deleteMany();
  const deletedTeams = await db.team.deleteMany();

  console.log(`  SponsorLead:      ${deletedLeads} rows deleted`);
  console.log(`  TeamMembership: ${deletedMemberships.count} rows deleted`);
  console.log(`  PlayerProfile:  ${deletedProfiles.count} rows deleted`);
  console.log(`  UserAccount:    ${deletedAccounts.count} rows deleted`);
  console.log(`  Team:           ${deletedTeams.count} rows deleted`);
  console.log("\nDone. Sign out and sign up again to re-test onboarding.");
  console.log("(Clerk accounts are unchanged — only Maxime DB rows were cleared.)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
