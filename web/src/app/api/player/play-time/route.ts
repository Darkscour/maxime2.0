import { NextResponse } from "next/server";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import { db } from "@/lib/db";

type PlayTimeBody = {
  hoursPerWeek?: number;
};

export async function PATCH(req: Request) {
  try {
    const account = await getOrCreateUserAccount();

    if (!account.playerProfile) {
      return NextResponse.json(
        { error: "Create a player profile before reporting play time." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as PlayTimeBody;
    const hours = body.hoursPerWeek;

    if (hours == null || !Number.isFinite(hours)) {
      return NextResponse.json(
        { error: "Enter a valid number of hours per week." },
        { status: 400 },
      );
    }

    if (hours < 0 || hours > 168) {
      return NextResponse.json(
        { error: "Hours per week must be between 0 and 168." },
        { status: 400 },
      );
    }

    const profile = await db.playerProfile.update({
      where: { userId: account.id },
      data: { hoursPerWeek: Math.round(hours) },
      select: {
        hoursPerWeek: true,
        game: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      hoursPerWeek: profile.hoursPerWeek,
      game: profile.game,
      updatedAt: profile.updatedAt.toISOString(),
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    console.error("[player/play-time]", e);
    return NextResponse.json(
      { error: "Could not save play time. Try again." },
      { status: 500 },
    );
  }
}
