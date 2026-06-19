import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function label(user) {
  const type = user.accountType ?? "unset";
  const tier = user.accountTier ?? user.playerProfile?.accountTier ?? user.membership?.team.accountTier ?? "unset";
  if (type === "team_manager") {
    return `${tier} manager${user.membership?.team ? ` (${user.membership.team.name})` : " (no team)"}`;
  }
  if (type === "player") {
    return `${tier} player${user.playerProfile ? ` (@${user.playerProfile.handle})` : ""}`;
  }
  if (user.playerProfile) return `player-ish / type unset (@${user.playerProfile.handle})`;
  if (user.membership) return `manager-ish / type unset (${user.membership.team.name})`;
  return "incomplete / type unset";
}

const users = await db.userAccount.findMany({
  orderBy: { createdAt: "asc" },
  select: {
    email: true,
    displayName: true,
    accountType: true,
    accountTier: true,
    onboardingComplete: true,
    managerVerificationStatus: true,
    membership: {
      select: {
        role: true,
        team: { select: { name: true, accountTier: true, school: true } },
      },
    },
    playerProfile: {
      select: {
        handle: true,
        accountTier: true,
        school: true,
      },
    },
  },
});

const comboSet = new Set();

console.log("EXISTING ACCOUNTS\n");
for (const user of users) {
  const combo = label(user);
  comboSet.add(combo);
  console.log(`Email: ${user.email ?? "(none)"}`);
  console.log(`  Name: ${user.displayName ?? "—"}`);
  console.log(`  accountType: ${user.accountType ?? "null"}`);
  console.log(`  accountTier: ${user.accountTier ?? "null"}`);
  console.log(`  Onboarding complete: ${user.onboardingComplete}`);
  if (user.membership) {
    console.log(`  Team: ${user.membership.team.name} (${user.membership.team.accountTier ?? "no tier"}) — role: ${user.membership.role}`);
  }
  if (user.playerProfile) {
    console.log(`  Player: @${user.playerProfile.handle} — tier: ${user.playerProfile.accountTier ?? "null"}, school: ${user.playerProfile.school ?? "—"}`);
  }
  console.log(`  → Audience: ${combo}`);
  console.log("");
}

console.log("=".repeat(50));
console.log(`Total accounts: ${users.length}`);
console.log("\nUnique audience combinations present:");
for (const c of [...comboSet].sort()) console.log(`  • ${c}`);

console.log("\nMissing combinations to test manually:");
const all = [
  "collegiate manager",
  "grassroots manager",
  "collegiate player",
  "grassroots player",
];
for (const target of all) {
  const has = [...comboSet].some((c) => c.startsWith(target));
  if (!has) console.log(`  ✗ ${target}`);
}

await db.$disconnect();
