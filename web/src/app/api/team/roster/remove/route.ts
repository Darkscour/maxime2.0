import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications-db";
import { removePlayerFromRoster } from "@/lib/team-roster";
import {
  canEditTeam,
  permissionErrorResponse,
  requireCaptainOrManager,
} from "@/lib/permissions";

export async function POST(req: Request) {
  try {
    const { teamId, team, role } = await requireCaptainOrManager();
    if (!canEditTeam(role)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = (await req.json()) as { userId?: string };
    if (!body.userId) {
      return NextResponse.json({ error: "Player is required." }, { status: 400 });
    }

    const result = await removePlayerFromRoster(teamId, body.userId);
    if (!result.ok) {
      if (result.reason === "NOT_A_PLAYER") {
        return NextResponse.json(
          { error: "Only player roster slots can be removed this way." },
          { status: 400 },
        );
      }
      return NextResponse.json({ error: "Player is not on your roster." }, { status: 404 });
    }

    try {
      await createNotification({
        userId: body.userId,
        type: "recruitment",
        title: `Removed from ${team.name}`,
        body: `You were removed from ${team.name}'s roster. You can join another team anytime.`,
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
