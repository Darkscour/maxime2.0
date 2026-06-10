import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications-db";
import { sendRecruitmentInvite, isPlayerOnTeam, removeFromWatchlist } from "@/lib/player-watchlist-db";
import {
  canEditTeam,
  permissionErrorResponse,
  requireTeamMembership,
} from "@/lib/permissions";

export async function POST(req: Request) {
  try {
    const { account, teamId, role } = await requireTeamMembership();
    if (!canEditTeam(role)) {
      return NextResponse.json(
        { error: "Only managers can send recruitment invites." },
        { status: 403 },
      );
    }

    const body = (await req.json()) as {
      playerProfileId?: string;
      message?: string;
    };
    if (!body.playerProfileId) {
      return NextResponse.json({ error: "Player is required." }, { status: 400 });
    }

    const team = await db.team.findUnique({
      where: { id: teamId },
      select: { name: true },
    });

    const profile = await db.playerProfile.findUnique({
      where: { id: body.playerProfileId },
      select: { userId: true, handle: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Player not found." }, { status: 404 });
    }

    if (await isPlayerOnTeam(teamId, body.playerProfileId)) {
      await removeFromWatchlist(teamId, body.playerProfileId);
      return NextResponse.json(
        { error: "This player is already on your roster." },
        { status: 409 },
      );
    }

    const defaultMessage = team
      ? `Hi ${profile.handle}, ${team.name} would like to invite you to join our roster. Accept the invite from your dashboard when you're ready.`
      : `Hi ${profile.handle}, we'd like to invite you to join our roster.`;

    await sendRecruitmentInvite({
      teamId,
      playerProfileId: body.playerProfileId,
      invitedByUserId: account.id,
      message: body.message?.trim() || defaultMessage,
    });

    try {
      await createNotification({
        userId: profile.userId,
        type: "recruitment",
        title: `Invite from ${team?.name ?? "a team"}`,
        body: body.message?.trim() || defaultMessage,
        href: "/dashboard",
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}
