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
