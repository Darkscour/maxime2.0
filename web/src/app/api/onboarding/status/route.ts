import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOnboardingStatusReadOnly } from "@/lib/auth-user";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ signedIn: false });
  }

  const status = await getOnboardingStatusReadOnly();
  return NextResponse.json({
    signedIn: true,
    ...status,
    onboardingComplete: status.onboardingComplete,
  });
}
