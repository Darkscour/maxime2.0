import { NextRequest, NextResponse } from "next/server";
import { resolveInstitutionLogo } from "@/lib/institution-logo-resolve";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("d")?.trim();
  if (!raw) {
    return NextResponse.json({ error: "Missing domain list." }, { status: 400 });
  }

  const parts = raw
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  const resolved = await resolveInstitutionLogo(null, parts);

  if (!resolved) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(resolved.body, {
    headers: {
      "Content-Type": resolved.contentType,
      "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
    },
  });
}
