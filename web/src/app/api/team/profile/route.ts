import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  permissionErrorResponse,
  requireCaptainOrManager,
} from "@/lib/permissions";
import {
  isLikelyTeamProfileImageUrl,
  validateTeamProfileImageDataUrl,
} from "@/lib/team-profile-image";

type TeamProfileBody = {
  name?: string;
  school?: string;
  games?: string[];
  region?: string;
  rosterSize?: number;
  discordUrl?: string;
  profileImageUrl?: string | null;
};

type TeamProfileErrorCode =
  | "INVALID_JSON"
  | "VALIDATION_ERROR"
  | "INVALID_IMAGE_FORMAT"
  | "PROFILE_IMAGE_TOO_LARGE"
  | "REQUEST_TOO_LARGE"
  | "MISSING_TEAM_COLUMN"
  | "FORBIDDEN_TEAM_EDIT"
  | "NO_TEAM"
  | "ONBOARDING_INCOMPLETE"
  | "UNAUTHORIZED"
  | "UNKNOWN_ERROR";

export async function PATCH(req: Request) {
  try {
    const { teamId } = await requireCaptainOrManager();

    const body = (await req.json()) as TeamProfileBody;
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

    const hasProfileImageUrl = Object.prototype.hasOwnProperty.call(
      body,
      "profileImageUrl",
    );
    const profileImageUrl = hasProfileImageUrl
      ? typeof body.profileImageUrl === "string"
        ? body.profileImageUrl.trim() || null
        : null
      : undefined;

    if (profileImageUrl) {
      if (profileImageUrl.startsWith("data:")) {
        const imageValidationError = validateTeamProfileImageDataUrl(profileImageUrl);
        if (imageValidationError === "INVALID_IMAGE_FORMAT") {
          return NextResponse.json(
            {
              code: "INVALID_IMAGE_FORMAT" satisfies TeamProfileErrorCode,
              error:
                "Unsupported image format. Use PNG, JPG, or WEBP.",
            },
            { status: 400 },
          );
        }
        if (imageValidationError === "PROFILE_IMAGE_TOO_LARGE") {
          return NextResponse.json(
            {
              code: "PROFILE_IMAGE_TOO_LARGE" satisfies TeamProfileErrorCode,
              error: "Profile image is too large. Please upload a smaller image.",
            },
            { status: 400 },
          );
        }
      } else if (!isLikelyTeamProfileImageUrl(profileImageUrl)) {
        return NextResponse.json(
          {
            code: "INVALID_IMAGE_FORMAT" satisfies TeamProfileErrorCode,
            error: "Profile image must be a valid URL.",
          },
          { status: 400 },
        );
      }
    }

    const team = await db.team.update({
      where: { id: teamId },
      data: {
        name,
        school: body.school?.trim() || null,
        games: body.games,
        region: body.region?.trim() || null,
        rosterSize: body.rosterSize ?? null,
        discordUrl: body.discordUrl?.trim() || null,
        ...(hasProfileImageUrl ? { profileImageUrl } : {}),
      },
    });

    return NextResponse.json({ ok: true, team });
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json(
        {
          code: "INVALID_JSON" satisfies TeamProfileErrorCode,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const err = permissionErrorResponse(e);
    if (err.status < 500) {
      return NextResponse.json(
        {
          ...err.body,
          code: mapPermissionErrorCode(e),
        },
        { status: err.status },
      );
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        e.code === "P2022" &&
        typeof e.meta?.column === "string" &&
        e.meta.column.includes("profileImageUrl")
      ) {
        return NextResponse.json(
          {
            code: "MISSING_TEAM_COLUMN" satisfies TeamProfileErrorCode,
            error:
              "Team image storage is not ready yet. Please contact support or try again shortly.",
          },
          { status: 500 },
        );
      }
    }

    console.error("[team/profile]", e);
    return NextResponse.json(
      {
        error: "Something went wrong.",
        code: "UNKNOWN_ERROR" satisfies TeamProfileErrorCode,
      },
      { status: 500 },
    );
  }
}

function mapPermissionErrorCode(e: unknown): TeamProfileErrorCode {
  if (!(e instanceof Error)) return "UNKNOWN_ERROR";
  switch (e.message) {
    case "UNAUTHORIZED":
      return "UNAUTHORIZED";
    case "ONBOARDING_INCOMPLETE":
      return "ONBOARDING_INCOMPLETE";
    case "NO_TEAM":
      return "NO_TEAM";
    case "FORBIDDEN_TEAM_EDIT":
      return "FORBIDDEN_TEAM_EDIT";
    default:
      return "UNKNOWN_ERROR";
  }
}
