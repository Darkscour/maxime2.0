import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getExistingUserAccount } from "@/lib/auth-user";
import { slugifyTeamName } from "@/lib/onboarding-options";
import { evaluateGrassrootsManagerVerification } from "@/lib/manager-verification";
import { isAccountTier } from "@/lib/account-tier";
import { evaluateInstitutionEmailVerification } from "@/lib/institution-verification";
import { requireInstitutionRecord } from "@/lib/institutions";

type TeamBody = {
  accountTier?: string;
  displayName?: string;
  name: string;
  institutionId?: string;
  games: string[];
  region?: string;
  rosterSize?: number;
  discordUrl?: string;
  managerTitle?: string;
  managerOrgEmail?: string;
  authorized?: boolean;
};

function membershipRoleFromTitle(title: string): "captain" | "manager" {
  return title === "Team Captain" ? "captain" : "manager";
}

export async function POST(req: Request) {
  try {
    const account = await getExistingUserAccount();
    if (!account) {
      return NextResponse.json(
        { error: "No Maxime account. Sign up before onboarding." },
        { status: 403 },
      );
    }

    if (account.accountType === "player") {
      return NextResponse.json(
        { error: "Player accounts cannot create a team. Use a manager account." },
        { status: 403 },
      );
    }

    if (account.membership) {
      return NextResponse.json(
        { error: "You already belong to a team." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as TeamBody;

    if (!isAccountTier(body.accountTier)) {
      return NextResponse.json(
        { error: "Select collegiate or grassroots account type." },
        { status: 400 },
      );
    }

    const accountTier = body.accountTier;
    const isCollegiate = accountTier === "collegiate";

    const name = body.name?.trim();
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Team name is required (at least 2 characters)." },
        { status: 400 },
      );
    }

    if (!body.games?.length) {
      return NextResponse.json(
        { error: "Select at least one game." },
        { status: 400 },
      );
    }

    let institutionId: string | null = null;
    let schoolName: string | null = null;
    let collegiateInstitution: Awaited<
      ReturnType<typeof requireInstitutionRecord>
    > = null;

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

      collegiateInstitution = institution;
      institutionId = institution.id;
      schoolName = institution.name;
    }

    if (!isCollegiate) {
      const region = body.region?.trim();
      if (!region) {
        return NextResponse.json(
          { error: "Primary region is required for grassroots teams." },
          { status: 400 },
        );
      }

      const displayName = body.displayName?.trim();
      if (!displayName || displayName.length < 2) {
        return NextResponse.json(
          { error: "Enter the name you want to use on Maxime (at least 2 characters)." },
          { status: 400 },
        );
      }
      if (displayName.length > 80) {
        return NextResponse.json(
          { error: "Display name must be 80 characters or fewer." },
          { status: 400 },
        );
      }
    }

    const managerTitle = body.managerTitle?.trim();
    const managerOrgEmail = isCollegiate
      ? body.managerOrgEmail?.trim()
      : (account.email?.trim() || body.managerOrgEmail?.trim());

    if (!managerTitle) {
      return NextResponse.json(
        { error: "Select your role at the organization." },
        { status: 400 },
      );
    }

    if (!managerOrgEmail) {
      return NextResponse.json(
        {
          error: isCollegiate
            ? "Official org or school email is required."
            : "Sign in with an email address to continue.",
        },
        { status: 400 },
      );
    }

    if (!body.authorized) {
      return NextResponse.json(
        { error: "Confirm you are authorized to manage this organization." },
        { status: 400 },
      );
    }

    const verification = isCollegiate
      ? evaluateInstitutionEmailVerification({
          email: managerOrgEmail,
          institution: collegiateInstitution!,
          signInEmail: account.email,
        })
      : evaluateGrassrootsManagerVerification({ orgEmail: managerOrgEmail });

    if (isCollegiate && verification.status !== "verified") {
      return NextResponse.json({ error: verification.reason }, { status: 400 });
    }

    let slug = slugifyTeamName(name) || "team";
    const slugTaken = await db.team.findUnique({ where: { slug } });
    if (slugTaken) slug = `${slug}-${Date.now().toString(36)}`;

    const membershipRole = membershipRoleFromTitle(managerTitle);

    const team = await db.$transaction(async (tx) => {
      const created = await tx.team.create({
        data: {
          name,
          slug,
          school: schoolName,
          institutionId,
          accountTier,
          games: body.games,
          region: body.region?.trim() || null,
          rosterSize: body.rosterSize ?? null,
          discordUrl: body.discordUrl?.trim() || null,
          onboardingComplete: true,
        },
      });

      await tx.teamMembership.create({
        data: {
          teamId: created.id,
          userId: account.id,
          role: membershipRole,
          status: "active",
        },
      });

      await tx.userAccount.update({
        where: { id: account.id },
        data: {
          accountType: "team_manager",
          accountTier,
          onboardingComplete: true,
          managerTitle,
          managerOrgEmail,
          managerVerificationStatus: verification.status,
          ...(!isCollegiate && body.displayName?.trim()
            ? { displayName: body.displayName.trim() }
            : {}),
        },
      });

      return created;
    });

    return NextResponse.json({
      ok: true,
      team: {
        id: team.id,
        name: team.name,
        inviteCode: team.inviteCode,
      },
      verification: {
        status: verification.status,
        reason: verification.reason,
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    console.error("[onboarding/team]", e);
    return NextResponse.json(
      { error: "Could not create team. Try again." },
      { status: 500 },
    );
  }
}
