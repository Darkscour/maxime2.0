import { NextResponse } from "next/server";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import { createNotification } from "@/lib/notifications-db";
import {
  getInviteById,
  updateInviteStatus,
} from "@/lib/player-watchlist-db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const account = await getOrCreateUserAccount();

    if (!account.playerProfile) {
      return NextResponse.json({ error: "Player profile required." }, { status: 400 });
    }

    const invite = await getInviteById(id);
    if (!invite || invite.status !== "pending") {
      return NextResponse.json({ error: "Invite not found." }, { status: 404 });
    }

    if (invite.playerUserId !== account.id) {
      return NextResponse.json({ error: "This invite is not for you." }, { status: 403 });
    }

    await updateInviteStatus(id, "declined");

    try {
      await createNotification({
        userId: invite.invitedByUserId,
        type: "recruitment",
        title: "Invite declined",
        body: `${account.playerProfile.handle} declined your recruitment invite.`,
        href: "/dashboard/watchlist",
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not decline invite." }, { status: 500 });
  }
}
