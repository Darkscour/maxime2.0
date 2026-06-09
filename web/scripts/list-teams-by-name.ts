import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const query = process.argv[2]?.trim() ?? "";
  const teams = await db.team.findMany({
    where: query
      ? { name: { contains: query, mode: "insensitive" } }
      : undefined,
    include: {
      members: {
        include: {
          user: { select: { email: true, accountType: true } },
        },
      },
    },
  });

  for (const team of teams) {
    console.log(`\n${team.name} (${team.id})`);
    for (const m of team.members) {
      console.log(`  - ${m.role}: ${m.user.email} (${m.user.accountType})`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
