import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications-db";
import {
  createTeamJoinRequest,
  fetchTeamManagerUserIds,
} from "@/lib/team-join-request-db";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import {
  permissionErrorResponse,
  requirePlayerProfile,
} from "@/lib/permissions";
import { canPlayerJoinTeam } from "@/lib/audience-guards";

export async function POST(req: Request) {
  try {
    const account = await requirePlayerProfile();
    const profile = account.playerProfile!;

    if (account.membership) {
      return NextResponse.json(
        { error: "Leave your current team before requesting to join another." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as { teamId?: string };
    const teamId = body.teamId?.trim();
    if (!teamId) {
      return NextResponse.json({ error: "Team is required." }, { status: 400 });
    }

    const team = await db.team.findUnique({
      where: { id: teamId },
      select: { id: true, name: true, onboardingComplete: true, accountTier: true },
    });

    if (!team?.onboardingComplete) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }
    if (!canPlayerJoinTeam(profile, team)) {
      return NextResponse.json(
        { error: "You can only request teams in your account tier." },
        { status: 403 },
      );
    }

    const pendingInvites = await fetchPendingInvitesForPlayer(profile.id, {
      accountTier: profile.accountTier,
      institutionId: profile.institutionId,
    });
    if (pendingInvites.some((invite) => invite.teamId === teamId)) {
      return NextResponse.json(
        { error: "This team already sent you an invite — check Team invites on your dashboard." },
        { status: 409 },
      );
    }

    const result = await createTeamJoinRequest({
      teamId,
      playerProfileId: profile.id,
    });

    if (!result.alreadyPending) {
      const managerIds = await fetchTeamManagerUserIds(teamId);
      const bodyText = `${profile.handle} requested to join ${team.name}. Review their scout profile and send an invite when ready.`;

      await Promise.all(
        managerIds.map((userId) =>
          createNotification({
            userId,
            type: "recruitment",
            title: "Join request",
            body: bodyText,
            href: `/dashboard/join-requests`,
          }).catch(() => undefined),
        ),
      );
    }

    return NextResponse.json({
      ok: true,
      alreadyPending: result.alreadyPending,
    });
  } catch (e) {
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}
