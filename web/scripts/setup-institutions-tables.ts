/**
 * Creates Institution table and FK columns on Team / PlayerProfile.
 * Run: npm run db:institutions-setup
 */

import { readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const sql = readFileSync(
    join(__dirname, "../prisma/migrations/20260608140000_institutions/migration.sql"),
    "utf8",
  );

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    await db.$executeRawUnsafe(`${statement};`);
  }

  console.log("Institution tables and columns ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
