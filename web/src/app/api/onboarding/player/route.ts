import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOnboardingUserAccount } from "@/lib/auth-user";
import {
  getRanksForGame,
  isPrimaryGame,
  PLAYER_BIO_MAX_LENGTH,
  ONBOARDING_REGIONS,
  isOnboardingRegion,
  isPlayerRole,
} from "@/lib/onboarding-options";
import { isAccountTier } from "@/lib/account-tier";
import { evaluateInstitutionEmailVerification } from "@/lib/institution-verification";
import { requireInstitutionRecord } from "@/lib/institutions";

type PlayerBody = {
  accountTier?: string;
  handle: string;
  game: string;
  role: string;
  rank: string;
  region: string;
  institutionId?: string;
  schoolEmail?: string;
  bio?: string;
  inviteCode?: string;
};

export async function POST(req: Request) {
  try {
    const account = await requireOnboardingUserAccount();
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

    if (!isAccountTier(body.accountTier)) {
      return NextResponse.json(
        { error: "Select collegiate or grassroots account type." },
        { status: 400 },
      );
    }

    const accountTier = body.accountTier;
    const isCollegiate = accountTier === "collegiate";

    const handle = body.handle?.trim();
    if (!handle || handle.length < 2) {
      return NextResponse.json(
        { error: "Player handle is required." },
        { status: 400 },
      );
    }

    if (!body.game || !body.role || !body.rank) {
      return NextResponse.json(
        { error: "Game, role, and rank are required." },
        { status: 400 },
      );
    }

    if (!isPlayerRole(body.role)) {
      return NextResponse.json(
        { error: "Select a valid in-game role." },
        { status: 400 },
      );
    }

    if (!body.region?.trim()) {
      return NextResponse.json(
        { error: "Region is required." },
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

    if (body.region && !isOnboardingRegion(body.region)) {
      return NextResponse.json(
        { error: `Select ${ONBOARDING_REGIONS.join(", ")} as your region.` },
        { status: 400 },
      );
    }

    let institutionId: string | null = null;
    let school: string | null = null;
    let playerSchoolEmail: string | null = null;
    let playerVerificationStatus: string | null = null;
    let resolvedRegion = body.region?.trim() ?? "";

    if (isCollegiate) {
      const institutionIdRaw = body.institutionId?.trim();
      if (!institutionIdRaw) {
        return NextResponse.json(
          { error: "Select your school / university from the list." },
          { status: 400 },
        );
      }

      const institution = await requireInstitutionRecord(institutionIdRaw);
      if (!institution) {
        return NextResponse.json(
          { error: "Selected school is not in our U.S. university list." },
          { status: 400 },
        );
      }

      institutionId = institution.id;
      school = institution.name;

      const schoolEmail = body.schoolEmail?.trim();
      if (!schoolEmail) {
        return NextResponse.json(
          { error: "School email is required to verify collegiate affiliation." },
          { status: 400 },
        );
      }

      const verification = evaluateInstitutionEmailVerification({
        email: schoolEmail,
        institution,
        signInEmail: account.email,
      });

      if (verification.status !== "verified") {
        return NextResponse.json({ error: verification.reason }, { status: 400 });
      }

      playerSchoolEmail = schoolEmail.toLowerCase();
      playerVerificationStatus = verification.status;
    }

    if (!isOnboardingRegion(resolvedRegion)) {
      return NextResponse.json(
        { error: `Select ${ONBOARDING_REGIONS.join(", ")} as your region.` },
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
          region: resolvedRegion,
          school,
          institutionId,
          accountTier,
          age: null,
          hoursPerWeek: null,
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
          accountTier,
          onboardingComplete: true,
          playerSchoolEmail,
          playerVerificationStatus,
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
    if (e instanceof Error && e.message === "NO_PLATFORM_ACCOUNT") {
      return NextResponse.json(
        { error: "Sign in required to save your profile." },
        { status: 401 },
      );
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
