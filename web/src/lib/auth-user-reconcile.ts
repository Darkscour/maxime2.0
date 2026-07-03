export type AccountRichnessInput = {
  id: string;
  onboardingComplete: boolean;
  accountType: string | null;
  accountTier: string | null;
  membership: unknown;
  playerProfile: unknown;
};

/** Score how much real Maxime data an account row holds (higher = canonical). */
export function accountRichness(account: AccountRichnessInput): number {
  let score = 0;
  if (account.onboardingComplete) score += 8;
  if (account.membership) score += 4;
  if (account.playerProfile) score += 4;
  if (account.accountType) score += 2;
  if (account.accountTier) score += 1;
  return score;
}

/** True when the row has never started onboarding — safe to delete on merge. */
export function isEmptyShellAccount(account: AccountRichnessInput): boolean {
  return (
    !account.onboardingComplete &&
    !account.accountType &&
    !account.accountTier &&
    !account.membership &&
    !account.playerProfile
  );
}

/** Pick which duplicate row to keep when clerkId and email resolve to different accounts. */
export function pickMergeTargets<T extends AccountRichnessInput>(
  byClerkId: T,
  byEmail: T,
): { canonical: T; orphan: T } {
  const canonical =
    accountRichness(byEmail) > accountRichness(byClerkId) ? byEmail : byClerkId;
  const orphan = canonical.id === byClerkId.id ? byEmail : byClerkId;
  return { canonical, orphan };
}

/** Placeholder clerkId used to detach a non-empty orphan before relinking. */
export function orphanPlaceholderClerkId(accountId: string): string {
  return `orphan:${accountId}`;
}
