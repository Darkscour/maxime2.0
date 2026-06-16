import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canEditTeam, permissionErrorResponse, requireTeamMembership } from "@/lib/permissions";
import { createDuelChallenge, listDuelsForTeam } from "@/lib/duels";
import { createNotification } from "@/lib/notifications-db";

export async function GET() {
  try {
    const { teamId, role, team } = await requireTeamMembership();
    if (!canEditTeam(role)) {
      return NextResponse.json({ error: "Only managers can access duels." }, { status: 403 });
    }
    if (team.accountTier !== "grassroots") {
      return NextResponse.json({ error: "Duels are available for grassroots teams only." }, { status: 403 });
    }

    const duels = await listDuelsForTeam(teamId);
    return NextResponse.json({ duels });
  } catch (e) {
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}

export async function POST(req: Request) {
  try {
    const { account, teamId, role, team } = await requireTeamMembership();
    if (!canEditTeam(role)) {
      return NextResponse.json({ error: "Only managers can create duels." }, { status: 403 });
    }
    if (team.accountTier !== "grassroots") {
      return NextResponse.json({ error: "Duels are available for grassroots teams only." }, { status: 403 });
    }

    const body = (await req.json()) as {
      targetTeamId?: string;
      game?: string;
      message?: string;
      scheduledAt?: string;
    };
    const targetTeamId = body.targetTeamId?.trim();
    const game = body.game?.trim();
    if (!targetTeamId || !game) {
      return NextResponse.json({ error: "Target team and game are required." }, { status: 400 });
    }

    const duel = await createDuelChallenge({
      challengerTeamId: teamId,
      targetTeamId,
      createdByUserId: account.id,
      game,
      message: body.message,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    });

    const targetManagers = await db.teamMembership.findMany({
      where: {
        teamId: targetTeamId,
        status: "active",
        role: { in: ["captain", "manager"] },
      },
      select: { userId: true },
    });
    await Promise.all(
      targetManagers.map((manager) =>
        createNotification({
          userId: manager.userId,
          type: "recruitment",
          title: "New duel challenge",
          body: `${team.name} challenged your team in ${duel.game}.`,
          href: "/dashboard/duels",
        }).catch(() => undefined),
      ),
    );

    return NextResponse.json({ ok: true, duel });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "DUEL_SELF_CHALLENGE") {
        return NextResponse.json({ error: "You cannot challenge your own team." }, { status: 400 });
      }
      if (e.message === "DUEL_TEAM_NOT_FOUND") {
        return NextResponse.json({ error: "Target team not found." }, { status: 404 });
      }
      if (e.message === "DUEL_GRASSROOTS_ONLY") {
        return NextResponse.json({ error: "Duels are for grassroots teams only." }, { status: 403 });
      }
      if (e.message === "DUEL_ALREADY_ACTIVE") {
        return NextResponse.json({ error: "A duel between these teams is already active." }, { status: 409 });
      }
    }
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}

