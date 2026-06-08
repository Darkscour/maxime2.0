/** Where to send a user right after Clerk sign-in or sign-up. */
export function resolvePostAuthPath(status: {
  onboardingComplete: boolean;
  accountType: string | null;
  hasTeam: boolean;
  hasPlayerProfile: boolean;
}): string {
  if (status.onboardingComplete) {
    return "/dashboard";
  }

  if (status.accountType === "team_manager" && !status.hasTeam) {
    return "/onboarding/team";
  }

  if (status.accountType === "player" && !status.hasPlayerProfile) {
    return "/onboarding/player";
  }

  if (status.hasTeam || status.hasPlayerProfile) {
    return "/onboarding/done";
  }

  return "/onboarding";
}
