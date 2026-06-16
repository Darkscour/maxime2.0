import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import { removeFromWatchlist } from "@/lib/player-watchlist-db";
import { canPlayerJoinTeam } from "@/lib/audience-guards";

export async function POST(req: Request) {
  try {
    const account = await getOrCreateUserAccount();

    if (account.accountType === "team_manager") {
      return NextResponse.json(
        { error: "Team managers cannot join a team with an invite code." },
        { status: 403 },
      );
    }

    if (account.membership) {
      return NextResponse.json(
        { error: "You are already on a team." },
        { status: 400 },
      );
    }

    if (!account.playerProfile) {
      return NextResponse.json(
        { error: "Complete your player profile first." },
        { status: 400 },
      );
    }

    const { inviteCode } = (await req.json()) as { inviteCode?: string };
    const code = inviteCode?.trim();
    if (!code) {
      return NextResponse.json(
        { error: "Invite code is required." },
        { status: 400 },
      );
    }

    const team = await db.team.findUnique({ where: { inviteCode: code } });
    if (!team) {
      return NextResponse.json(
        { error: "Invalid invite code." },
        { status: 404 },
      );
    }
    if (!canPlayerJoinTeam(account.playerProfile, team)) {
      return NextResponse.json(
        { error: "You can only join teams in your account tier." },
        { status: 403 },
      );
    }

    await db.$transaction([
      db.teamMembership.create({
        data: {
          teamId: team.id,
          userId: account.id,
          role: "player",
          status: "active",
        },
      }),
      db.userAccount.update({
        where: { id: account.id },
        data: { onboardingComplete: true, accountType: "player" },
      }),
    ]);

    await removeFromWatchlist(team.id, account.playerProfile.id);

    return NextResponse.json({
      ok: true,
      team: { id: team.id, name: team.name },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    console.error("[onboarding/join]", e);
    return NextResponse.json(
      { error: "Could not join team. Try again." },
      { status: 500 },
    );
  }
}
