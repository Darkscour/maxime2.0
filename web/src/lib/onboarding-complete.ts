export type AccountType = "team_manager" | "player" | null;

export type OnboardingAccountSlice = {
  accountType: string | null;
  accountTier?: string | null;
  onboardingComplete: boolean;
  membership: { role: string; teamId: string } | null;
  playerProfile: { id: string } | null;
};

/** Derive whether onboarding is truly complete from stored profile data. */
export function deriveOnboardingComplete(account: OnboardingAccountSlice): boolean {
  if (account.accountType === "team_manager") {
    return !!account.membership;
  }

  if (account.accountType === "player") {
    return !!account.playerProfile;
  }

  // Fallback for legacy rows before accountType was set.
  return !!account.playerProfile || !!account.membership;
}

export type OnboardingProgress = {
  step: number;
};

export function getOnboardingProgress(account: OnboardingAccountSlice): OnboardingProgress {
  if (deriveOnboardingComplete(account)) {
    return { step: 3 };
  }

  if (account.accountType === "team_manager") {
    return { step: account.membership ? 3 : account.accountTier ? 2 : 1 };
  }

  if (account.accountType === "player") {
    return { step: account.playerProfile ? 3 : account.accountTier ? 2 : 1 };
  }

  return { step: 0 };
}

/** Returns a redirect path when the user should not access `path`, else null. */
export function getOnboardingRouteGuard(
  path: string,
  account: OnboardingAccountSlice,
  options?: { testMode?: boolean; reviseMode?: boolean },
): string | null {
  if (options?.testMode || options?.reviseMode) return null;

  const complete = deriveOnboardingComplete(account);

  if (complete && path.startsWith("/onboarding") && !path.startsWith("/onboarding/done")) {
    return "/dashboard";
  }

  if (path === "/onboarding") {
    if (complete) return "/dashboard";
    if (account.playerProfile || account.membership) {
      return "/onboarding/done";
    }
    return null;
  }

  if (path === "/onboarding/team/tier") {
    if (account.membership) return "/dashboard";
    return null;
  }

  if (path === "/onboarding/player/tier") {
    if (account.playerProfile && complete) return "/dashboard";
    return null;
  }

  if (path === "/onboarding/team") {
    if (account.accountType === "player" && !account.playerProfile) {
      return "/onboarding/player";
    }
    if (account.membership) return "/dashboard";
    return null;
  }

  if (path === "/onboarding/player") {
    if (account.accountType === "team_manager" && !account.membership) {
      return "/onboarding/team";
    }
    if (account.playerProfile && complete) return "/dashboard";
    return null;
  }

  if (path === "/onboarding/join") {
    if (!account.playerProfile) return "/onboarding/player";
    if (account.membership) return "/dashboard";
    return null;
  }

  if (path === "/onboarding/done") {
    if (!complete && !account.playerProfile && !account.membership) {
      return "/onboarding";
    }
    return null;
  }

  return null;
}
