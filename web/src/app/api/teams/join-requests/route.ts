import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications-db";
import { dismissJoinRequest } from "@/lib/team-join-request-db";
import {
  canEditTeam,
  permissionErrorResponse,
  requireTeamMembership,
} from "@/lib/permissions";

export async function DELETE(req: Request) {
  try {
    const { teamId, role } = await requireTeamMembership();
    if (!canEditTeam(role)) {
      return NextResponse.json(
        { error: "Only managers can dismiss join requests." },
        { status: 403 },
      );
    }

    const body = (await req.json()) as { playerProfileId?: string };
    if (!body.playerProfileId) {
      return NextResponse.json({ error: "Player is required." }, { status: 400 });
    }

    const [profile, team] = await Promise.all([
      db.playerProfile.findUnique({
        where: { id: body.playerProfileId },
        select: { userId: true, handle: true },
      }),
      db.team.findUnique({
        where: { id: teamId },
        select: { name: true },
      }),
    ]);

    await dismissJoinRequest(teamId, body.playerProfileId);

    if (profile && team) {
      try {
        await createNotification({
          userId: profile.userId,
          type: "recruitment",
          title: "Join request declined",
          body: `${team.name} is not moving forward with your join request right now. Browse other teams when you're ready.`,
          href: "/dashboard/teams",
        });
      } catch (e) {
        console.error("[join-requests DELETE] notification", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}
