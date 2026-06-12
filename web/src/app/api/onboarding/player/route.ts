import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import {
  getRanksForGame,
  isPrimaryGame,
  PLAYER_BIO_MAX_LENGTH,
  PLAYER_ONBOARDING_REGIONS,
} from "@/lib/onboarding-options";

type PlayerBody = {
  handle: string;
  game: string;
  role: string;
  rank: string;
  region: string;
  school?: string;
  age: number;
  hoursPerWeek?: number;
  bio?: string;
  inviteCode?: string;
};

export async function POST(req: Request) {
  try {
    const account = await getOrCreateUserAccount();

    if (account.accountType === "team_manager") {
      return NextResponse.json(
        { error: "Team managers use the team profile, not a player profile." },
        { status: 403 },
      );
    }

    if (account.playerProfile) {
      return NextResponse.json(
        { error: "Player profile already exists." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as PlayerBody;
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

    if (!isPrimaryGame(body.game)) {
      return NextResponse.json(
        { error: "Select a supported primary game." },
        { status: 400 },
      );
    }

    if (!getRanksForGame(body.game).includes(body.rank)) {
      return NextResponse.json(
        { error: "Select a rank that matches your primary game." },
        { status: 400 },
      );
    }

    if (
      !PLAYER_ONBOARDING_REGIONS.includes(
        body.region as (typeof PLAYER_ONBOARDING_REGIONS)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Select NA East or NA West as your region." },
        { status: 400 },
      );
    }

    const age = body.age;
    if (age == null || Number.isNaN(age) || age < 13 || age > 99) {
      return NextResponse.json(
        { error: "Age is required (13–99)." },
        { status: 400 },
      );
    }

    const handleTaken = await db.playerProfile.findUnique({
      where: { handle },
    });
    if (handleTaken) {
      return NextResponse.json(
        { error: "That handle is already taken." },
        { status: 400 },
      );
    }

    const bio = body.bio?.trim();
    if (bio && bio.length > PLAYER_BIO_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Bio must be ${PLAYER_BIO_MAX_LENGTH} characters or fewer.` },
        { status: 400 },
      );
    }

    const inviteCode = body.inviteCode?.trim();
    let joinedTeam: { id: string; name: string } | null = null;

    const result = await db.$transaction(async (tx) => {
      const profile = await tx.playerProfile.create({
        data: {
          userId: account.id,
          handle,
          game: body.game,
          role: body.role,
          rank: body.rank,
          region: body.region,
          school: body.school?.trim() || null,
          age,
          hoursPerWeek: body.hoursPerWeek ?? null,
          status: "Available",
          tags: [],
          bio: bio || null,
        },
      });

      let membership = null;
      if (inviteCode) {
        const team = await tx.team.findUnique({ where: { inviteCode } });
        if (!team) {
          throw new Error("INVALID_INVITE");
        }
        if (account.membership) {
          throw new Error("ALREADY_ON_TEAM");
        }
        membership = await tx.teamMembership.create({
          data: {
            teamId: team.id,
            userId: account.id,
            role: "player",
            status: "active",
          },
        });
        joinedTeam = { id: team.id, name: team.name };
      }

      await tx.userAccount.update({
        where: { id: account.id },
        data: {
          accountType: "player",
          onboardingComplete: true,
        },
      });

      return { profile, membership, joinedTeam };
    });

    return NextResponse.json({
      ok: true,
      playerProfile: { id: result.profile.id, handle: result.profile.handle },
      team: result.joinedTeam,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (e instanceof Error && e.message === "INVALID_INVITE") {
      return NextResponse.json(
        { error: "Invalid team invite code." },
        { status: 400 },
      );
    }
    if (e instanceof Error && e.message === "ALREADY_ON_TEAM") {
      return NextResponse.json(
        { error: "You are already on a team." },
        { status: 400 },
      );
    }
    console.error("[onboarding/player]", e);
    return NextResponse.json(
      { error: "Could not save player profile. Try again." },
      { status: 500 },
    );
  }
}
