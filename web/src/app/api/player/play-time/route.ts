import { NextResponse } from "next/server";
import { db } from "@/lib/db";
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
    const err = permissionErrorResponse(e);
    if (err.status < 500) {
      return NextResponse.json(err.body, { status: err.status });
    }
    console.error("[player/play-time]", e);
    return NextResponse.json(err.body, { status: 500 });
  }
}
