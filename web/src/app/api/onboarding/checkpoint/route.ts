import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncOnboardingCheckpoint } from "@/lib/persist-onboarding-progress";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await req.json()) as { pathname?: string; search?: string };
  const pathname = body.pathname?.trim();
  if (!pathname?.startsWith("/onboarding")) {
    return NextResponse.json({ error: "Invalid onboarding path." }, { status: 400 });
  }

  await syncOnboardingCheckpoint(pathname, body.search ?? "");
  return NextResponse.json({ ok: true });
}
