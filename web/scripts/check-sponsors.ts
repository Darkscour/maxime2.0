import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  try {
    const prismaRows = await db.sponsor.findMany({ take: 3 });
    console.log("PRISMA_SPONSOR_COUNT", await db.sponsor.count());
    console.log("PRISMA_SAMPLE", JSON.stringify(prismaRows, null, 2));
  } catch (e) {
    console.log("PRISMA_ERROR", e);
  }

  try {
    type RawRow = {
      ID: string;
      Name: string;
      Industry: string | null;
      sponsor_link: string | null;
    };
    const raw = await db.$queryRaw<RawRow[]>`
      SELECT "ID", "Name", "Industry", "sponsor_link"
      FROM "Sponsor"
      WHERE "ID" IS NOT NULL AND "ID" <> ''
      LIMIT 5
    `;
    console.log("RAW_COUNT_QUERY");
    const count = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*)::bigint as count FROM "Sponsor"
      WHERE "ID" IS NOT NULL AND TRIM("ID") <> ''
    `;
    console.log("RAW_SPONSOR_COUNT", count[0]?.count?.toString());
    console.log("RAW_SAMPLE", JSON.stringify(raw, null, 2));
  } catch (e) {
    console.log("RAW_ERROR", e);
  }
}

main()
  .finally(() => db.$disconnect());
