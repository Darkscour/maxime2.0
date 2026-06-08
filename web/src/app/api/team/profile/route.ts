import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUserAccount } from "@/lib/auth-user";

type TeamProfileBody = {
  name?: string;
  school?: string;
  games?: string[];
  region?: string;
  rosterSize?: number;
  avgViewers?: number;
  discordUrl?: string;
};

function canEditTeam(role: string | null | undefined) {
  return role === "captain" || role === "manager";
}

export async function PATCH(req: Request) {
  try {
    const account = await getOrCreateUserAccount();
    const membership = account.membership;

    if (!membership?.team) {
      return NextResponse.json({ error: "You are not on a team." }, { status: 400 });
    }

    if (!canEditTeam(membership.role)) {
      return NextResponse.json(
        { error: "Only captains and managers can edit team info." },
        { status: 403 },
      );
    }

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
      where: { id: membership.team.id },
      data: {
        name,
        school: body.school?.trim() || null,
        games: body.games,
        region: body.region?.trim() || null,
        rosterSize: body.rosterSize ?? null,
        avgViewers: body.avgViewers ?? null,
        discordUrl: body.discordUrl?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true, team });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    console.error("[team/profile]", e);
    return NextResponse.json(
      { error: "Could not update team profile. Try again." },
      { status: 500 },
    );
  }
}
