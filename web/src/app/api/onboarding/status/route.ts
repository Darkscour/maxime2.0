import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOnboardingStatusReadOnly } from "@/lib/auth-user";
import { isTransientDbError } from "@/lib/db-retry";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ signedIn: false });
  }

  try {
    const status = await getOnboardingStatusReadOnly();
    return NextResponse.json({
      signedIn: true,
      ...status,
      onboardingComplete: status.onboardingComplete,
    });
  } catch (error) {
    console.error("[onboarding/status]", error);
    return NextResponse.json(
      {
        signedIn: true,
        degraded: true,
        onboardingComplete: false,
        hasTeam: false,
        hasPlayerProfile: false,
        error: isTransientDbError(error)
          ? "Database temporarily unavailable."
          : "Could not load account status.",
      },
      { status: isTransientDbError(error) ? 503 : 500 },
    );
  }
}
