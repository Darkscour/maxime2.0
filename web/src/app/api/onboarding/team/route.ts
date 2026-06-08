import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUserAccount } from "@/lib/auth-user";
import { slugifyTeamName } from "@/lib/onboarding-options";
import { evaluateManagerVerification } from "@/lib/manager-verification";

type TeamBody = {
  name: string;
  school?: string;
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
    const account = await getOrCreateUserAccount();

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

    const managerTitle = body.managerTitle?.trim();
    const managerOrgEmail = body.managerOrgEmail?.trim();

    if (!managerTitle) {
      return NextResponse.json(
        { error: "Select your role at the organization." },
        { status: 400 },
      );
    }

    if (!managerOrgEmail) {
      return NextResponse.json(
        { error: "Official org or school email is required." },
        { status: 400 },
      );
    }

    if (!body.authorized) {
      return NextResponse.json(
        { error: "Confirm you are authorized to manage this organization." },
        { status: 400 },
      );
    }

    const verification = evaluateManagerVerification({
      orgEmail: managerOrgEmail,
      school: body.school,
      signInEmail: account.email,
    });

    let slug = slugifyTeamName(name) || "team";
    const slugTaken = await db.team.findUnique({ where: { slug } });
    if (slugTaken) slug = `${slug}-${Date.now().toString(36)}`;

    const membershipRole = membershipRoleFromTitle(managerTitle);

    const team = await db.$transaction(async (tx) => {
      const created = await tx.team.create({
        data: {
          name,
          slug,
          school: body.school?.trim() || null,
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
          onboardingComplete: true,
          managerTitle,
          managerOrgEmail,
          managerVerificationStatus: verification.status,
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
