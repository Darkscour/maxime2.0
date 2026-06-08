import { deriveOnboardingComplete } from "@/lib/onboarding-complete";

export type AuthIntent = "sign-in" | "sign-up";

export type PostAuthInput = {
  accountType: string | null;
  onboardingComplete: boolean;
  hasTeam: boolean;
  hasPlayerProfile: boolean;
  membershipRole?: string | null;
  intent: AuthIntent;
  hadPlatformAccount: boolean;
};

function onboardingPath(status: Omit<PostAuthInput, "intent" | "hadPlatformAccount">) {
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

/** Where to send a user right after Clerk sign-in or sign-up. */
export function resolvePostAuthPath(status: PostAuthInput): string {
  const complete = deriveOnboardingComplete({
    accountType: status.accountType,
    onboardingComplete: status.onboardingComplete,
    membership: status.hasTeam
      ? { role: status.membershipRole ?? "player", teamId: "post-auth" }
      : null,
    playerProfile: status.hasPlayerProfile ? { id: "post-auth" } : null,
  });

  // Returning users with a finished profile always go to the dashboard.
  if (complete) {
    if (status.intent === "sign-up") {
      return "/dashboard?notice=existing-account";
    }
    return "/dashboard";
  }

  // New sign-ups always begin at onboarding role selection.
  if (status.intent === "sign-up") {
    return "/onboarding";
  }

  if (status.intent === "sign-in" && !status.hadPlatformAccount) {
    return "/onboarding?notice=no-platform-account";
  }

  return onboardingPath(status);
}
