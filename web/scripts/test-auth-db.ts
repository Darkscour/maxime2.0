/**
 * Auth + user database diagnostic.
 * Run: npx tsx scripts/test-auth-db.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function tableExists(name: string): Promise<boolean> {
  const rows = await db.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = ${name}
    ) AS exists
  `;
  return rows[0]?.exists ?? false;
}

async function countTable(name: string): Promise<number | null> {
  try {
    const rows = await db.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*)::bigint AS count FROM "${name}"`,
    );
    return Number(rows[0]?.count ?? 0);
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Clerk environment (presence only) ===");
  const clerkKeys = [
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  ];
  for (const key of clerkKeys) {
    const val = process.env[key];
    console.log(`  ${key}: ${val ? "set" : "MISSING"}`);
  }

  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  if (pubKey.startsWith("pk_test_")) {
    console.log("  Clerk mode: development (pk_test_)");
  } else if (pubKey.startsWith("pk_live_")) {
    console.log("  Clerk mode: production (pk_live_)");
  } else if (pubKey) {
    console.log("  Clerk mode: unknown key prefix");
  }

  console.log("\n=== Supabase / Postgres connection ===");
  try {
    await db.$queryRaw`SELECT 1 AS ok`;
    console.log("  Database: connected");
  } catch (e) {
    console.error("  Database: FAILED", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  console.log("\n=== User-related tables ===");
  const userTables = [
    "UserAccount",
    "Team",
    "TeamMembership",
    "PlayerProfile",
  ];

  for (const table of userTables) {
    const exists = await tableExists(table);
    const count = exists ? await countTable(table) : null;
    console.log(
      `  ${table}: ${exists ? "exists" : "MISSING"}${count !== null ? ` (${count} rows)` : ""}`,
    );
  }

  console.log("\n=== Prisma UserAccount model ===");
  try {
    const accounts = await db.userAccount.findMany({
      take: 3,
      select: {
        id: true,
        clerkId: true,
        email: true,
        onboardingComplete: true,
        accountType: true,
      },
    });
    console.log(`  Prisma query OK — sample count up to 3: ${accounts.length}`);
    if (accounts.length > 0) {
      for (const a of accounts) {
        console.log(
          `    · ${a.email ?? "no email"} | onboarding=${a.onboardingComplete} | type=${a.accountType ?? "unset"}`,
        );
      }
    } else {
      console.log("  No UserAccount rows yet (users appear after first /onboarding visit).");
    }
  } catch (e) {
    console.error(
      "  Prisma UserAccount query FAILED — run: npx prisma generate",
    );
    console.error(" ", e instanceof Error ? e.message : e);
  }

  console.log("\n=== How auth + user data work in Maxime ===");
  console.log("  1. Clerk handles sign-in/sign-up (identity, sessions, OAuth).");
  console.log("  2. Supabase stores app data in UserAccount (linked by clerkId).");
  console.log("  3. UserAccount is created on first authenticated /onboarding or API call.");
  console.log("  4. Clerk does NOT store team/player profiles — Supabase does.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
