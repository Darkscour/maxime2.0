import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getOnboardingStatus } from "@/lib/auth-user";
import { getOnboardingRouteGuard } from "@/lib/onboarding-complete";
import { buildOnboardingHref } from "@/lib/onboarding-path";

async function readNoticeFromRequest(): Promise<string | undefined> {
  const headerStore = await headers();
  const search =
    headerStore.get("x-search") ??
    new URL(headerStore.get("x-url") ?? "http://local/onboarding", "http://local")
      .search;
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  return params.get("notice") ?? undefined;
}

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
  if (guard) {
    const notice = await readNoticeFromRequest();
    redirect(
      notice
        ? buildOnboardingHref(guard, { extra: { notice } })
        : guard,
    );
  }

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
