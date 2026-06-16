import { NextResponse } from "next/server";
import { getInstitutionCount, searchInstitutions } from "@/lib/institutions";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";

    if (q.trim().length < 2) {
      const total = await getInstitutionCount();
      return NextResponse.json({
        results: [],
        total,
        needsBootstrap: total === 0,
      });
    }

    const results = await searchInstitutions(q, 20);
    const total = await getInstitutionCount();

    return NextResponse.json({
      results,
      total,
      needsBootstrap: total === 0,
    });
  } catch (e) {
    console.error("[api/institutions/search]", e);
    return NextResponse.json(
      {
        results: [],
        error: "Could not search schools. Try again in a moment.",
      },
      { status: 500 },
    );
  }
}
