import { NextResponse } from "next/server";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import {
  countUnreadNotifications,
  fetchNotifications,
  markNotificationsRead,
} from "@/lib/notifications-db";

export async function GET() {
  try {
    const account = await getOrCreateUserAccount();
    const [items, unread] = await Promise.all([
      fetchNotifications(account.id),
      countUnreadNotifications(account.id),
    ]);
    return NextResponse.json({ items, unread });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    console.error("[notifications GET]", e);
    return NextResponse.json({ items: [], unread: 0 });
  }
}

export async function PATCH(req: Request) {
  try {
    const account = await getOrCreateUserAccount();
    const body = (await req.json()) as { ids?: string[] };
    await markNotificationsRead(account.id, body.ids);
    const unread = await countUnreadNotifications(account.id);
    return NextResponse.json({ ok: true, unread });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not update notifications." }, { status: 500 });
  }
}
