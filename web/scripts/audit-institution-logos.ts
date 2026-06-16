import { resolveInstitutionLogo } from "../src/lib/institution-logo-resolve";
import { db } from "../src/lib/db";

async function main() {
  const rows = await db.$queryRawUnsafe<
    { name: string; primaryDomain: string | null; domains: string[] }[]
  >(
    `SELECT name, "primaryDomain", domains FROM "Institution" ORDER BY RANDOM() LIMIT 60`,
  );

  let ok = 0;
  const failed: string[] = [];

  for (const row of rows) {
    const resolved = await resolveInstitutionLogo(
      row.primaryDomain,
      row.domains,
    );
    if (resolved) {
      ok += 1;
    } else {
      failed.push(`${row.name} (${row.primaryDomain})`);
    }
  }

  console.log(`Resolved ${ok}/${rows.length}`);
  if (failed.length) {
    console.log("Failed:");
    for (const f of failed) console.log(" -", f);
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
