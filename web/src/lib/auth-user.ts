import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { deriveOnboardingComplete } from "@/lib/onboarding-complete";

export async function requireClerkId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");
  return userId;
}

const accountInclude = {
  membership: { include: { team: true } },
  playerProfile: true,
} as const;

export type UserAccountWithRelations = Awaited<
  ReturnType<typeof getOrCreateUserAccount>
>;

async function clerkIdentity() {
  const clerkUser = await currentUser();
  const email =
    clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ?? clerkUser?.emailAddresses[0]?.emailAddress;

  const displayName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    undefined;

  return { email, displayName };
}

/** Fetch the Maxime UserAccount row without creating one. */
export async function getExistingUserAccount() {
  const clerkId = await requireClerkId();
  return db.userAccount.findUnique({
    where: { clerkId },
    include: accountInclude,
  });
}

/** Get or create the Maxime UserAccount row for the signed-in Clerk user. */
export async function getOrCreateUserAccount() {
  const clerkId = await requireClerkId();
  const { email, displayName } = await clerkIdentity();

  const existing = await db.userAccount.findUnique({
    where: { clerkId },
    include: accountInclude,
  });

  if (existing) {
    if (existing.email !== email || existing.displayName !== displayName) {
      return db.userAccount.update({
        where: { id: existing.id },
        data: { email: email ?? null, displayName: displayName ?? null },
        include: accountInclude,
      });
    }
    return existing;
  }

  return db.userAccount.create({
    data: {
      clerkId,
      email,
      displayName,
    },
    include: accountInclude,
  });
}

/** Used after Clerk auth to detect first-time platform users vs returning ones. */
export async function resolveUserAccountOnAuth() {
  const clerkId = await requireClerkId();
  const { email, displayName } = await clerkIdentity();

  const existing = await db.userAccount.findUnique({
    where: { clerkId },
    include: accountInclude,
  });

  if (existing) {
    if (existing.email !== email || existing.displayName !== displayName) {
      const account = await db.userAccount.update({
        where: { id: existing.id },
        data: { email: email ?? null, displayName: displayName ?? null },
        include: accountInclude,
      });
      return { account, hadPlatformAccount: true };
    }
    return { account: existing, hadPlatformAccount: true };
  }

  const account = await db.userAccount.create({
    data: {
      clerkId,
      email,
      displayName,
    },
    include: accountInclude,
  });

  return { account, hadPlatformAccount: false };
}

export async function syncOnboardingCompleteFlag(
  account: Awaited<ReturnType<typeof getOrCreateUserAccount>>,
) {
  const derived = deriveOnboardingComplete(account);
  if (account.onboardingComplete === derived) return account;

  return db.userAccount.update({
    where: { id: account.id },
    data: { onboardingComplete: derived },
    include: {
      membership: { include: { team: true } },
      playerProfile: true,
    },
  });
}

export async function getOnboardingStatus() {
  const account = await syncOnboardingCompleteFlag(await getOrCreateUserAccount());
  return {
    accountType: account.accountType,
    onboardingComplete: account.onboardingComplete,
    hasTeam: !!account.membership,
    hasPlayerProfile: !!account.playerProfile,
    team: account.membership?.team ?? null,
    membershipRole: account.membership?.role ?? null,
    playerProfile: account.playerProfile,
    displayName: account.displayName,
    email: account.email,
  };
}

/** Read-only account details for the user settings page. */
export async function getAccountSettings() {
  const account = await syncOnboardingCompleteFlag(await getOrCreateUserAccount());
  const clerkUser = await currentUser();

  const email =
    account.email ??
    clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress ??
    null;

  return {
    displayName: account.displayName,
    email,
    accountType: account.accountType,
    onboardingComplete: account.onboardingComplete,
    joinedAt: account.createdAt,
    clerkImageUrl: clerkUser?.imageUrl ?? null,
    clerkUsername: clerkUser?.username ?? null,
    membershipRole: account.membership?.role ?? null,
    managerTitle: account.managerTitle,
    managerVerificationStatus: account.managerVerificationStatus,
  };
}

/** Full account context for the signed-in app dashboard. */
export async function getDashboardContext() {
  const account = await syncOnboardingCompleteFlag(await getOrCreateUserAccount());
  const team = account.membership?.team ?? null;

  let teamWithMeta = null;
  if (team) {
    const memberCount = await db.teamMembership.count({
      where: { teamId: team.id, status: "active" },
    });
    teamWithMeta = {
      id: team.id,
      name: team.name,
      school: team.school,
      games: team.games,
      region: team.region,
      rosterSize: team.rosterSize,
      discordUrl: team.discordUrl,
      inviteCode: team.inviteCode,
      createdAt: team.createdAt,
      memberCount,
    };
  }

  return {
    displayName: account.displayName,
    email: account.email,
    accountType: account.accountType,
    onboardingComplete: account.onboardingComplete,
    managerTitle: account.managerTitle,
    managerOrgEmail: account.managerOrgEmail,
    managerVerificationStatus: account.managerVerificationStatus,
    team: teamWithMeta,
    membershipRole: account.membership?.role ?? null,
    playerProfile: account.playerProfile,
  };
}
