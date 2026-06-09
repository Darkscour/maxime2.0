import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const query = process.argv[2]?.trim() ?? "";
  const users = await db.userAccount.findMany({
    where: query
      ? { email: { contains: query, mode: "insensitive" } }
      : undefined,
    include: { membership: { include: { team: true } } },
  });

  for (const u of users) {
    console.log(
      `${u.email} (${u.accountType}) team=${u.membership?.team?.name ?? "none"} role=${u.membership?.role ?? "—"}`,
    );
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
