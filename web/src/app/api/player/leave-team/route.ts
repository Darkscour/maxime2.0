import { NextResponse } from "next/server";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import { leaveCurrentTeam } from "@/lib/team-membership";

export async function POST() {
  try {
    const account = await getOrCreateUserAccount();

    if (account.membership?.role !== "player") {
      return NextResponse.json(
        {
          error:
            account.membership
              ? "Managers and captains cannot leave this way. Update your team in settings."
              : "You are not on a team.",
        },
        { status: 400 },
      );
    }

    const result = await leaveCurrentTeam(account.id);
    if (!result.left) {
      if (result.reason === "MANAGER_HAS_ROSTER") {
        return NextResponse.json(
          { error: "Transfer captaincy before leaving a team with other members." },
          { status: 400 },
        );
      }
      return NextResponse.json({ error: "You are not on a team." }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      teamName: result.teamName,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    console.error("[player/leave-team]", e);
    return NextResponse.json({ error: "Could not leave team." }, { status: 500 });
  }
}
