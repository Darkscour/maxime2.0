import { deriveOnboardingComplete } from "@/lib/onboarding-complete";
import { appendMaximeSignupPending } from "@/lib/auth-intent";
import {
  hasOnboardingProgress,
  resolveIncompleteOnboardingPath,
} from "@/lib/onboarding-resume";

export type AuthIntent = "sign-in" | "sign-up";

export type PostAuthInput = {
  accountType: string | null;
  accountTier?: string | null;
  onboardingComplete: boolean;
  hasTeam: boolean;
  hasPlayerProfile: boolean;
  membershipRole?: string | null;
  teamId?: string;
  playerProfileId?: string;
  intent: AuthIntent;
  hadPlatformAccount: boolean;
};

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

  // Incomplete users with saved progress resume where they left off.
  const progress = {
    accountType: status.accountType,
    accountTier: status.accountTier,
    hasTeam: status.hasTeam,
    hasPlayerProfile: status.hasPlayerProfile,
  };

  if (status.hadPlatformAccount || hasOnboardingProgress(progress)) {
    const path = resolveIncompleteOnboardingPath(status);
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}notice=existing-account-resume`;
  }

  // Brand-new platform users start at role selection.
  if (status.intent === "sign-up") {
    return appendMaximeSignupPending("/onboarding");
  }

  // Sign-in without a platform profile — never shown during sign-up.
  return "/auth/no-maxime-account";
}
