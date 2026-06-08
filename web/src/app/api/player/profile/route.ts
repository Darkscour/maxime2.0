import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUserAccount } from "@/lib/auth-user";

type PlayerProfileBody = {
  handle?: string;
  game?: string;
  role?: string;
  rank?: string;
  region?: string;
  school?: string;
  age?: number;
  hoursPerWeek?: number;
  status?: string;
  tags?: string[];
  bio?: string;
};

export async function PATCH(req: Request) {
  try {
    const account = await getOrCreateUserAccount();

    if (!account.playerProfile) {
      return NextResponse.json(
        { error: "Create a player profile first." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as PlayerProfileBody;
    const handle = body.handle?.trim();

    if (!handle || handle.length < 2) {
      return NextResponse.json(
        { error: "Player handle is required." },
        { status: 400 },
      );
    }

    if (!body.game || !body.role || !body.rank || !body.region) {
      return NextResponse.json(
        { error: "Game, role, rank, and region are required." },
        { status: 400 },
      );
    }

    if (body.hoursPerWeek != null) {
      if (
        !Number.isFinite(body.hoursPerWeek) ||
        body.hoursPerWeek < 0 ||
        body.hoursPerWeek > 168
      ) {
        return NextResponse.json(
          { error: "Hours per week must be between 0 and 168." },
          { status: 400 },
        );
      }
    }

    if (handle !== account.playerProfile.handle) {
      const handleTaken = await db.playerProfile.findUnique({
        where: { handle },
      });
      if (handleTaken) {
        return NextResponse.json(
          { error: "That handle is already taken." },
          { status: 400 },
        );
      }
    }

    const profile = await db.playerProfile.update({
      where: { userId: account.id },
      data: {
        handle,
        game: body.game,
        role: body.role,
        rank: body.rank,
        region: body.region,
        school: body.school?.trim() || null,
        age: body.age ?? null,
        hoursPerWeek: body.hoursPerWeek ?? null,
        status: body.status || "Available",
        tags: body.tags ?? [],
        bio: body.bio?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true, playerProfile: profile });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    console.error("[player/profile]", e);
    return NextResponse.json(
      { error: "Could not update player profile. Try again." },
      { status: 500 },
    );
  }
}
