import { NextResponse } from "next/server";
import {
  addToWatchlist,
  fetchTeamWatchlist,
  isPlayerOnTeam,
  removeFromWatchlist,
} from "@/lib/player-watchlist-db";
import {
  canEditTeam,
  permissionErrorResponse,
  requireTeamMembership,
} from "@/lib/permissions";
import { canManagerRecruitPlayer } from "@/lib/audience-guards";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { teamId, role } = await requireTeamMembership();
    if (!canEditTeam(role)) {
      return NextResponse.json({ error: "Only managers can view the watchlist." }, { status: 403 });
    }
    const items = await fetchTeamWatchlist(teamId);
    return NextResponse.json({ items });
  } catch (e) {
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}

export async function POST(req: Request) {
  try {
    const { account, teamId, role } = await requireTeamMembership();
    if (!canEditTeam(role)) {
      return NextResponse.json({ error: "Only managers can update the watchlist." }, { status: 403 });
    }

    const body = (await req.json()) as { playerProfileId?: string };
    if (!body.playerProfileId) {
      return NextResponse.json({ error: "Player is required." }, { status: 400 });
    }

    if (await isPlayerOnTeam(teamId, body.playerProfileId)) {
      return NextResponse.json(
        { error: "This player is already on your roster." },
        { status: 409 },
      );
    }
    const [team, player] = await Promise.all([
      db.team.findUnique({
        where: { id: teamId },
        select: { accountTier: true, institutionId: true },
      }),
      db.playerProfile.findUnique({
        where: { id: body.playerProfileId },
        select: { accountTier: true, institutionId: true },
      }),
    ]);
    if (!team || !player) {
      return NextResponse.json({ error: "Player not found." }, { status: 404 });
    }
    if (!canManagerRecruitPlayer(team, player)) {
      return NextResponse.json(
        { error: "This player is outside your recruitment pool." },
        { status: 403 },
      );
    }

    await addToWatchlist({
      teamId,
      playerProfileId: body.playerProfileId,
      addedByUserId: account.id,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}

export async function DELETE(req: Request) {
  try {
    const { teamId, role } = await requireTeamMembership();
    if (!canEditTeam(role)) {
      return NextResponse.json({ error: "Only managers can update the watchlist." }, { status: 403 });
    }

    const body = (await req.json()) as { playerProfileId?: string };
    if (!body.playerProfileId) {
      return NextResponse.json({ error: "Player is required." }, { status: 400 });
    }

    await removeFromWatchlist(teamId, body.playerProfileId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = permissionErrorResponse(e);
    return NextResponse.json(err.body, { status: err.status });
  }
}
