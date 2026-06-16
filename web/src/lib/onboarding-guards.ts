import { redirect } from "next/navigation";
import { getOnboardingStatus } from "@/lib/auth-user";
import { getOnboardingRouteGuard } from "@/lib/onboarding-complete";

/** Server-only: redirect away from onboarding routes the user shouldn't access. */
export async function enforceOnboardingRoute(
  path: string,
  options?: { testMode?: boolean; reviseMode?: boolean },
) {
  const status = await getOnboardingStatus();
  const account = {
    accountType: status.accountType,
    accountTier: status.accountTier,
    onboardingComplete: status.onboardingComplete,
    membership: status.hasTeam
      ? { role: status.membershipRole ?? "player", teamId: status.team!.id }
      : null,
    playerProfile: status.hasPlayerProfile
      ? { id: status.playerProfile!.id }
      : null,
  };

  const guard = getOnboardingRouteGuard(path, account, options);
  if (guard) redirect(guard);

  return status;
}

export function isOnboardingTestMode(
  searchParams: { test?: string } | undefined,
): boolean {
  return searchParams?.test === "1";
}

export function isOnboardingReviseMode(
  searchParams: { revise?: string } | undefined,
): boolean {
  return searchParams?.revise === "1";
}
