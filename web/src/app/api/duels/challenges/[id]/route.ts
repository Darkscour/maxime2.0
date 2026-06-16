import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canEditTeam, permissionErrorResponse, requireTeamMembership } from "@/lib/permissions";
import { isDuelStatus, updateDuelStatus } from "@/lib/duels";
import { createNotification } from "@/lib/notifications-db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { teamId, role, team } = await requireTeamMembership();
    if (!canEditTeam(role)) {
      return NextResponse.json({ error: "Only managers can update duels." }, { status: 403 });
    }
    if (team.accountTier !== "grassroots") {
      return NextResponse.json({ error: "Duels are available for grassroots teams only." }, { status: 403 });
    }

    const body = (await req.json()) as { status?: string };
    if (!body.status || !isDuelStatus(body.status)) {
      return NextResponse.json({ error: "Valid duel status is required." }, { status: 400 });
    }

    const duel = await updateDuelStatus({
      duelId: id,
      teamId,
      status: body.status,
    });

    const notifyUserIds =
      duel.challengerTeamId === teamId
        ? await managerIdsForTeam(duel.targetTeamId)
        : await managerIdsForTeam(duel.challengerTeamId);

    const verb =
      body.status === "accepted"
        ? "accepted"
        : body.status === "declined"
          ? "declined"
          : body.status === "cancelled"
            ? "cancelled"
            : "completed";
    await Promise.all(
      notifyUserIds.map((userId) =>
        createNotification({
          userId,
          type: "recruitment",
          title: "Duel updated",
          body: `${team.name} ${verb} a duel challenge.`,
          href: "/dashboard/duels",
        }).catch(() => undefined),
      ),
    );

    return NextResponse.json({ ok: true, duel });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "DUEL_NOT_FOUND") {
        return NextResponse.json({ error: "Duel not found." }, { status: 404 });
      }
      if (e.message === "DUEL_FORBIDDEN") {
        return NextResponse.json({ error: "This duel is not for your team." }, { status: 403 });
      }
      if (e.message === "DUEL_INVALID_TRANSITION") {
        return NextResponse.json({ error: "That status change is not allowed." }, { status: 409 });
      }
    }
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}

async function managerIdsForTeam(teamId: string): Promise<string[]> {
  const managers = await db.teamMembership.findMany({
    where: {
      teamId,
      status: "active",
      role: { in: ["captain", "manager"] },
    },
    select: { userId: true },
  });
  return managers.map((m) => m.userId);
}

