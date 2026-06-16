import { resolveInstitutionLogo } from "../src/lib/institution-logo-resolve";
import { db } from "../src/lib/db";

const TEST_NAMES = [
  "Long Island University",
  "Virginia State University",
  "Wheaton College, Norton MA",
  "Maharishi University of Management",
  "Daniel Webster College",
  "University of Maryland, College Park",
];

async function main() {
  for (const name of TEST_NAMES) {
    const rows = await db.$queryRawUnsafe<
      { name: string; primaryDomain: string | null; domains: string[] }[]
    >(
      `SELECT name, "primaryDomain", domains FROM "Institution" WHERE name = $1 LIMIT 1`,
      name,
    );
    const row = rows[0];
    if (!row) {
      console.log("MISSING ROW", name);
      continue;
    }

    const resolved = await resolveInstitutionLogo(
      row.primaryDomain,
      row.domains,
    );
    console.log(
      resolved
        ? `OK  ${row.name} (${row.primaryDomain}, +${row.domains.length - 1} alt)`
        : `FAIL ${row.name} (${row.primaryDomain})`,
      resolved ? `${resolved.contentType} ${resolved.body.byteLength}b` : "",
    );
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
