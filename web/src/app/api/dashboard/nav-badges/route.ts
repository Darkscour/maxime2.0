import { NextResponse } from "next/server";
import { getDashboardContext } from "@/lib/auth-user";
import { managerPoolContext } from "@/lib/audience-guards";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import { fetchPendingJoinRequestsForTeam } from "@/lib/team-join-request-db";

export async function GET() {
  try {
    const ctx = await getDashboardContext();

    if (ctx.accountType === "team_manager" && ctx.team) {
      const requests = await fetchPendingJoinRequestsForTeam(
        ctx.team.id,
        managerPoolContext({
          accountTier: ctx.team.accountTier,
          institutionId: ctx.team.institutionId,
        }),
      );
      return NextResponse.json({ joinRequests: requests.length });
    }

    if (ctx.playerProfile) {
      const invites = await fetchPendingInvitesForPlayer(ctx.playerProfile.id, {
        accountTier: ctx.playerProfile.accountTier ?? ctx.accountTier,
        institutionId: ctx.playerProfile.institutionId,
      });
      return NextResponse.json({ teamInvites: invites.length });
    }

    return NextResponse.json({});
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    return NextResponse.json({});
  }
}
