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

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  href?: string | null;
}) {
  const id = randomUUID();
  await db.$executeRaw`
    INSERT INTO "UserNotification" ("id", "userId", "type", "title", "body", "href", "read", "createdAt")
    VALUES (${id}, ${input.userId}, ${input.type}, ${input.title}, ${input.body}, ${input.href ?? null}, false, NOW())
  `;
  return { id };
}

export async function fetchNotifications(
  userId: string,
  limit = 20,
): Promise<NotificationRow[]> {
  return db.$queryRaw<NotificationRow[]>`
    SELECT "id", "type", "title", "body", "href", "read", "createdAt"
    FROM "UserNotification"
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
    LIMIT ${limit}
  `;
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const rows = await db.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count
    FROM "UserNotification"
    WHERE "userId" = ${userId} AND "read" = false
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function markNotificationsRead(userId: string, ids?: string[]) {
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
}
