import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  permissionErrorResponse,
  requireCaptainOrManager,
} from "@/lib/permissions";

type TeamProfileBody = {
  name?: string;
  school?: string;
  games?: string[];
  region?: string;
  rosterSize?: number;
  discordUrl?: string;
};

export async function PATCH(req: Request) {
  try {
    const { teamId } = await requireCaptainOrManager();

    const body = (await req.json()) as TeamProfileBody;
    const name = body.name?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Team name is required (at least 2 characters)." },
        { status: 400 },
      );
    }

    if (!body.games?.length) {
      return NextResponse.json(
        { error: "Select at least one game." },
        { status: 400 },
      );
    }

    const team = await db.team.update({
      where: { id: teamId },
      data: {
        name,
        school: body.school?.trim() || null,
        games: body.games,
        region: body.region?.trim() || null,
        rosterSize: body.rosterSize ?? null,
        discordUrl: body.discordUrl?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true, team });
  } catch (e) {
    const err = permissionErrorResponse(e);
    if (err.status < 500) {
      return NextResponse.json(err.body, { status: err.status });
    }
    console.error("[team/profile]", e);
    return NextResponse.json(err.body, { status: 500 });
  }
}
