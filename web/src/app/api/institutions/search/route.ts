import { NextResponse } from "next/server";
import { hasInstitutions, searchInstitutions } from "@/lib/institutions";

const BOOTSTRAP_CACHE_TTL_MS = 60_000;
let bootstrapCache: { value: boolean; at: number } | null = null;

async function needsBootstrapCached() {
  const now = Date.now();
  if (bootstrapCache && now - bootstrapCache.at < BOOTSTRAP_CACHE_TTL_MS) {
    return bootstrapCache.value;
  }
  const hasAny = await hasInstitutions();
  const value = !hasAny;
  bootstrapCache = { value, at: now };
  return value;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const needsBootstrap = await needsBootstrapCached();

    if (q.trim().length < 2) {
      return NextResponse.json({
        results: [],
        needsBootstrap,
      });
    }

    const results = await searchInstitutions(q, 20);

    return NextResponse.json({
      results,
      needsBootstrap,
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
