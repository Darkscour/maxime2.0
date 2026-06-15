import { NextResponse } from "next/server";
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

    await dismissJoinRequest(teamId, body.playerProfileId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}
