import { NextResponse } from "next/server";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import { createNotification } from "@/lib/notifications-db";
import {
  getInviteById,
  updateInviteStatus,
} from "@/lib/player-watchlist-db";
import { joinTeamAsPlayer } from "@/lib/team-membership";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const account = await getOrCreateUserAccount();

    if (!account.playerProfile) {
      return NextResponse.json(
        { error: "Complete your player profile first." },
        { status: 400 },
      );
    }

    const invite = await getInviteById(id);
    if (!invite || invite.status !== "pending") {
      return NextResponse.json({ error: "Invite not found." }, { status: 404 });
    }

    if (invite.playerUserId !== account.id) {
      return NextResponse.json({ error: "This invite is not for you." }, { status: 403 });
    }

    const join = await joinTeamAsPlayer(account.id, invite.teamId);
    if (!join.ok) {
      return NextResponse.json(
        {
          error: "You're already on a team. Leave your current team before accepting.",
          code: "ALREADY_ON_TEAM",
        },
        { status: 409 },
      );
    }

    await updateInviteStatus(id, "accepted");

    try {
      await createNotification({
        userId: invite.invitedByUserId,
        type: "recruitment",
        title: "Invite accepted",
        body: `${account.playerProfile.handle} joined ${invite.teamName}.`,
        href: "/dashboard/watchlist",
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      ok: true,
      team: { id: invite.teamId, name: invite.teamName },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    console.error("[invites/accept]", e);
    return NextResponse.json({ error: "Could not accept invite." }, { status: 500 });
  }
}
