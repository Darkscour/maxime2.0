import { db } from "@/lib/db";
import type { AccountTier } from "@/lib/account-tier";
import { isAccountTier } from "@/lib/account-tier";
import { getExistingUserAccount } from "@/lib/auth-user";

const accountInclude = {
  membership: { include: { team: true } },
  playerProfile: true,
} as const;

function parseTier(search: string): AccountTier | null {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const tier = params.get("tier");
  return isAccountTier(tier ?? undefined) ? (tier as AccountTier) : null;
}

/**
 * Persist the onboarding step that matches the page the user is on right now.
 * Going back clears later-step fields so resume lands on the current stage.
 */
export async function syncOnboardingCheckpoint(pathname: string, search: string) {
  const account = await getExistingUserAccount();
  if (!account) return null;

  if (account.membership || account.playerProfile) {
    return account;
  }

  const tierFromQuery = parseTier(search);

  if (pathname === "/onboarding") {
    if (!account.accountType && !account.accountTier) {
      return account;
    }

    return db.userAccount.update({
      where: { id: account.id },
      data: { accountType: null, accountTier: null },
      include: accountInclude,
    });
  }

  if (pathname === "/onboarding/team/tier") {
    return db.userAccount.update({
      where: { id: account.id },
      data: { accountType: "team_manager", accountTier: null },
      include: accountInclude,
    });
  }

  if (pathname === "/onboarding/player/tier") {
    return db.userAccount.update({
      where: { id: account.id },
      data: { accountType: "player", accountTier: null },
      include: accountInclude,
    });
  }

  if (pathname === "/onboarding/team") {
    const accountTier = tierFromQuery ?? account.accountTier;
    if (!isAccountTier(accountTier ?? undefined)) {
      return db.userAccount.update({
        where: { id: account.id },
        data: { accountType: "team_manager", accountTier: null },
        include: accountInclude,
      });
    }

    return db.userAccount.update({
      where: { id: account.id },
      data: {
        accountType: "team_manager",
        accountTier,
      },
      include: accountInclude,
    });
  }

  if (pathname === "/onboarding/player") {
    const accountTier = tierFromQuery ?? account.accountTier;
    if (!isAccountTier(accountTier ?? undefined)) {
      return db.userAccount.update({
        where: { id: account.id },
        data: { accountType: "player", accountTier: null },
        include: accountInclude,
      });
    }

    return db.userAccount.update({
      where: { id: account.id },
      data: {
        accountType: "player",
        accountTier,
      },
      include: accountInclude,
    });
  }

  return account;
}
