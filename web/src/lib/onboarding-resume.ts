import {
  deriveOnboardingComplete,
} from "@/lib/onboarding-complete";
import { isAccountTier } from "@/lib/account-tier";
import { buildOnboardingHref } from "@/lib/onboarding-path";

export type OnboardingResumeInput = {
  accountType: string | null;
  accountTier?: string | null;
  onboardingComplete: boolean;
  hasTeam: boolean;
  hasPlayerProfile: boolean;
  membershipRole?: string | null;
  teamId?: string;
  playerProfileId?: string;
};

/** True when the user has started but not finished onboarding. */
export function hasOnboardingProgress(account: {
  accountType: string | null;
  accountTier?: string | null;
  hasTeam?: boolean;
  hasPlayerProfile?: boolean;
}): boolean {
  return !!(
    account.accountType ||
    account.accountTier ||
    account.hasTeam ||
    account.hasPlayerProfile
  );
}

/** Pick the correct in-progress onboarding route for a signed-in user. */
export function resolveIncompleteOnboardingPath(
  account: OnboardingResumeInput,
): string {
  const slice = {
    accountType: account.accountType,
    accountTier: account.accountTier ?? null,
    onboardingComplete: account.onboardingComplete,
    membership: account.hasTeam
      ? {
          role: account.membershipRole ?? "player",
          teamId: account.teamId ?? "resume",
        }
      : null,
    playerProfile: account.hasPlayerProfile
      ? { id: account.playerProfileId ?? "resume" }
      : null,
  };

  if (deriveOnboardingComplete(slice)) {
    return "/dashboard";
  }

  if (slice.membership || slice.playerProfile) {
    return "/onboarding/done";
  }

  if (account.accountType === "team_manager" && !account.hasTeam) {
    if (account.accountTier && isAccountTier(account.accountTier)) {
      return buildOnboardingHref("/onboarding/team", {
        tier: account.accountTier,
      });
    }
    return "/onboarding/team/tier";
  }

  if (account.accountType === "player" && !account.hasPlayerProfile) {
    if (account.accountTier && isAccountTier(account.accountTier)) {
      return buildOnboardingHref("/onboarding/player", {
        tier: account.accountTier,
      });
    }
    return "/onboarding/player/tier";
  }

  return "/onboarding";
}
