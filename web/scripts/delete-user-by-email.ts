/**
 * Deletes a Maxime platform account (and related team data) by email.
 * Also removes the Clerk user so sign-up can be tested fresh with the same email.
 *
 * Run: npx tsx scripts/delete-user-by-email.ts sahithg@sis.edu.in
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type ClerkUser = {
  id: string;
  email_addresses?: { email_address?: string }[];
};

async function deleteClerkUserByEmail(email: string): Promise<void> {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    console.warn("  CLERK_SECRET_KEY missing — skipped Clerk user deletion.");
    return;
  }

  const listRes = await fetch(
    `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${secret}` } },
  );

  if (!listRes.ok) {
    throw new Error(`Clerk list users failed: ${listRes.status} ${await listRes.text()}`);
  }

  const users = (await listRes.json()) as ClerkUser[];
  if (!Array.isArray(users) || users.length === 0) {
    console.log("  No Clerk user found for this email.");
    return;
  }

  console.log(`  Found ${users.length} Clerk user(s) for ${email}.`);
  for (const user of users) {
    const delRes = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!delRes.ok) {
      throw new Error(`Clerk delete failed: ${delRes.status} ${await delRes.text()}`);
    }
    console.log(`  Clerk user deleted: ${user.id}`);
  }

  // Verify deletion with one follow-up list call so test resets are deterministic.
  const verifyRes = await fetch(
    `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${secret}` } },
  );
  if (!verifyRes.ok) {
    throw new Error(
      `Clerk delete verification failed: ${verifyRes.status} ${await verifyRes.text()}`,
    );
  }

  const remaining = (await verifyRes.json()) as ClerkUser[];
  if (Array.isArray(remaining) && remaining.length > 0) {
    const ids = remaining.map((u) => u.id).join(", ");
    throw new Error(`Clerk user still exists after delete for ${email}. Remaining ids: ${ids}`);
  }

  console.log("  Clerk deletion verified: no users remain for this email.");
}

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
    console.log("Checking Clerk…");
    await deleteClerkUserByEmail(email);
    console.log("\nDone. Sign out in the browser, then use Get started to register fresh.");
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
  console.log(`\nUserAccount deleted.`);

  console.log("Deleting Clerk identity…");
  await deleteClerkUserByEmail(email);
  console.log("\nDone. Sign out in the browser, then use Get started to register fresh.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
