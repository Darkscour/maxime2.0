import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireCaptainOrManager } from "@/lib/permissions";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_UPLOAD_BYTES = 500 * 1024;

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { teamId } = await requireCaptainOrManager();
    const body = (await req.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const safePathname = normalizePathname(pathname);
        return {
          allowedContentTypes: ALLOWED_IMAGE_TYPES,
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          tokenPayload: JSON.stringify({
            teamId,
            source: "team-profile-image",
            clientPayload,
            safePathname,
          }),
        };
      },
      onUploadCompleted: async () => {
        // No-op for now; client saves final blob URL through PATCH /api/team/profile.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[team/profile/upload]", error);
    return NextResponse.json(
      {
        code: "UPLOAD_INIT_FAILED",
        error:
          "Could not initialize team image upload. Check storage configuration and try again.",
      },
      { status: 500 },
    );
  }
}

function normalizePathname(pathname: string): string {
  const cleaned = pathname.replace(/[^a-zA-Z0-9._/-]/g, "-");
  if (!cleaned.trim()) {
    return "team-profile-image.webp";
  }
  if (cleaned.includes("..")) {
    return "team-profile-image.webp";
  }
  return cleaned;
}
