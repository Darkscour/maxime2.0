import { randomUUID } from "crypto";
import { db } from "@/lib/db";

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: Date;
};

const CREATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS "UserNotification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "href" TEXT,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE
)`;

function isMissingNotificationTable(e: unknown): boolean {
  const msg =
    e && typeof e === "object" && "message" in e
      ? String((e as { message: unknown }).message)
      : "";
  return msg.includes("UserNotification") && msg.includes("does not exist");
}

async function ensureNotificationTable() {
  await db.$executeRawUnsafe(CREATE_TABLE_SQL);
  await db.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserNotification_userId_read_createdAt_idx" ON "UserNotification"("userId", "read", "createdAt")`,
  );
}

async function withNotificationSchema<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (!isMissingNotificationTable(e)) throw e;
    await ensureNotificationTable();
    return fn();
  }
}

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  href?: string | null;
}) {
  return withNotificationSchema(async () => {
    const id = randomUUID();
    await db.$executeRaw`
      INSERT INTO "UserNotification" ("id", "userId", "type", "title", "body", "href", "read", "createdAt")
      VALUES (${id}, ${input.userId}, ${input.type}, ${input.title}, ${input.body}, ${input.href ?? null}, false, NOW())
    `;
    return { id };
  });
}

export async function fetchNotifications(
  userId: string,
  limit = 20,
): Promise<NotificationRow[]> {
  return withNotificationSchema(() =>
    db.$queryRaw<NotificationRow[]>`
      SELECT "id", "type", "title", "body", "href", "read", "createdAt"
      FROM "UserNotification"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
    `,
  );
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  return withNotificationSchema(async () => {
    const rows = await db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "UserNotification"
      WHERE "userId" = ${userId} AND "read" = false
    `;
    return Number(rows[0]?.count ?? 0);
  });
}

export async function markNotificationsRead(userId: string, ids?: string[]) {
  return withNotificationSchema(async () => {
    if (ids && ids.length > 0) {
      for (const id of ids) {
        await db.$executeRaw`
          UPDATE "UserNotification"
          SET "read" = true
          WHERE "id" = ${id} AND "userId" = ${userId}
        `;
      }
      return;
    }
    await db.$executeRaw`
      UPDATE "UserNotification"
      SET "read" = true
      WHERE "userId" = ${userId} AND "read" = false
    `;
  });
}
