import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logPlayerPlayTime } from "@/lib/player-analytics";
import {
  permissionErrorResponse,
  requirePlayerProfile,
} from "@/lib/permissions";

type PlayTimeBody = {
  hoursPerWeek?: number;
};

export async function PATCH(req: Request) {
  try {
    const account = await requirePlayerProfile();

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

    const rounded = Math.round(hours);
    const profile = await db.playerProfile.update({
      where: { userId: account.id },
      data: { hoursPerWeek: rounded },
      select: {
        id: true,
        hoursPerWeek: true,
        game: true,
        updatedAt: true,
      },
    });

    await logPlayerPlayTime({
      playerProfileId: profile.id,
      hoursPerWeek: rounded,
    });

    return NextResponse.json({
      ok: true,
      hoursPerWeek: profile.hoursPerWeek,
      game: profile.game,
      updatedAt: profile.updatedAt.toISOString(),
    });
  } catch (e) {
    const err = permissionErrorResponse(e);
    if (err.status < 500) {
      return NextResponse.json(err.body, { status: err.status });
    }
    console.error("[player/play-time]", e);
    return NextResponse.json(err.body, { status: 500 });
  }
}
