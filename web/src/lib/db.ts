import { PrismaClient } from "@prisma/client";

/**
 * `db` — the single Prisma client used everywhere in the app.
 *
 * Why the global cache:
 *   Next.js dev mode hot-reloads your code on every save, which would
 *   otherwise spawn a fresh PrismaClient (and a new pool of database
 *   connections) every time. Pinning the client on `globalThis` reuses
 *   the same one across reloads and prevents Supabase connection limits
 *   from filling up.
 *
 * Import it anywhere on the server like:
 *   import { db } from "@/lib/db";
 *   const players = await db.player.findMany();
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
