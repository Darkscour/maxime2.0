import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { deriveOnboardingComplete } from "@/lib/onboarding-complete";
import { hasOnboardingProgress } from "@/lib/onboarding-resume";

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
  ReturnType<typeof loadUserAccountWithRelations>
>;

async function loadUserAccountWithRelations(id: string) {
  return db.userAccount.findUniqueOrThrow({
    where: { id },
    include: accountInclude,
  });
}

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

type AccountWithRelations = UserAccountWithRelations;

type AccountRichnessInput = {
  onboardingComplete: boolean;
  accountType: string | null;
  accountTier: string | null;
  membership: unknown;
  playerProfile: unknown;
};

function accountRichness(account: AccountRichnessInput) {
  let score = 0;
  if (account.onboardingComplete) score += 8;
  if (account.membership) score += 4;
  if (account.playerProfile) score += 4;
  if (account.accountType) score += 2;
  if (account.accountTier) score += 1;
  return score;
}

/** True once the user has started or finished Maxime onboarding — not a blank shell row. */
export function isMeaningfulMaximeAccount(account: {
  onboardingComplete: boolean;
  accountType: string | null;
  accountTier?: string | null;
  membership?: unknown | null;
  playerProfile?: unknown | null;
}): boolean {
  if (account.onboardingComplete) return true;
  return hasOnboardingProgress({
    accountType: account.accountType,
    accountTier: account.accountTier,
    hasTeam: !!account.membership,
    hasPlayerProfile: !!account.playerProfile,
  });
}

async function resolveLinkedAccount(
  account: UserAccountWithRelations,
  email: string | undefined,
  displayName: string | undefined,
  createIfMissing: boolean,
): Promise<{
  account: UserAccountWithRelations | null;
  hadPlatformAccount: boolean;
}> {
  if (isMeaningfulMaximeAccount(account)) {
    const synced = await syncIdentityFields(account, email, displayName);
    return { account: synced, hadPlatformAccount: true };
  }

  if (!createIfMissing) {
    await db.userAccount.deleteMany({ where: { id: account.id } });
    return { account: null, hadPlatformAccount: false };
  }

  const synced = await syncIdentityFields(account, email, displayName);
  return { account: synced, hadPlatformAccount: false };
}

async function findUserAccountByEmail(email: string | undefined | null) {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;

  const matches = await db.userAccount.findMany({
    where: { email: { equals: normalized, mode: "insensitive" } },
    include: accountInclude,
  });

  if (matches.length === 0) return null;

  return matches.reduce((best, current) =>
    accountRichness(current) > accountRichness(best) ? current : best,
  );
}

async function deleteEmptyDuplicateIfNeeded(orphanId: string, keepId: string) {
  if (orphanId === keepId) return;

  const orphan = await db.userAccount.findUnique({
    where: { id: orphanId },
    include: accountInclude,
  });

  if (!orphan || accountRichness(orphan) > 0) return;

  await db.userAccount.deleteMany({ where: { id: orphanId } });
}

async function syncIdentityFields(
  account: AccountWithRelations,
  email: string | undefined,
  displayName: string | undefined,
): Promise<AccountWithRelations> {
  const keepDisplayName = account.displayName?.trim();
  const nextDisplayName = keepDisplayName || displayName?.trim() || null;
  const nextEmail = email ?? null;

  if (account.email === nextEmail && account.displayName === nextDisplayName) {
    return account;
  }

  return db.userAccount.update({
    where: { id: account.id },
    data: { email: nextEmail, displayName: nextDisplayName },
    include: accountInclude,
  });
}

function isClerkIdUniqueViolation(error: unknown): boolean {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== "P2002"
  ) {
    return false;
  }

  const target = error.meta?.target;
  if (Array.isArray(target)) {
    return target.includes("clerkId");
  }
  return String(target ?? "").includes("clerkId");
}

async function createPlatformUserAccount(
  clerkId: string,
  email: string | undefined,
  displayName: string | undefined,
): Promise<UserAccountWithRelations> {
  try {
    return await db.userAccount.create({
      data: {
        clerkId,
        email,
        displayName,
      },
      include: accountInclude,
    });
  } catch (error) {
    if (!isClerkIdUniqueViolation(error)) throw error;

    const existing = await db.userAccount.findUnique({
      where: { clerkId },
      include: accountInclude,
    });
    if (!existing) throw error;

    return syncIdentityFields(existing, email, displayName);
  }
}

/**
 * Match the signed-in Clerk user to a Maxime UserAccount.
 * Prefers email when Clerk recreated the user (new clerkId, same email).
 */
async function reconcileUserAccount(
  clerkId: string,
  email: string | undefined,
  displayName: string | undefined,
  options?: {
    createIfMissing?: boolean;
    preloadedByClerkId?: UserAccountWithRelations | null;
  },
): Promise<{
  account: UserAccountWithRelations | null;
  hadPlatformAccount: boolean;
}> {
  const createIfMissing = options?.createIfMissing ?? true;
  const byClerkId =
    options?.preloadedByClerkId !== undefined
      ? options.preloadedByClerkId
      : await db.userAccount.findUnique({
          where: { clerkId },
          include: accountInclude,
        });
  const byEmail = await findUserAccountByEmail(email);

  if (byClerkId && byEmail && byClerkId.id !== byEmail.id) {
    const canonical =
      accountRichness(byEmail) > accountRichness(byClerkId) ? byEmail : byClerkId;
    const orphan = canonical.id === byClerkId.id ? byEmail : byClerkId;

    const account = await db.userAccount.update({
      where: { id: canonical.id },
      data: {
        clerkId,
        email: email ?? null,
        displayName: canonical.displayName?.trim() || displayName?.trim() || null,
      },
      include: accountInclude,
    });

    await deleteEmptyDuplicateIfNeeded(orphan.id, canonical.id);
    return resolveLinkedAccount(account, email, displayName, createIfMissing);
  }

  if (byClerkId) {
    return resolveLinkedAccount(byClerkId, email, displayName, createIfMissing);
  }

  if (byEmail) {
    const account = await db.userAccount.update({
      where: { id: byEmail.id },
      data: {
        clerkId,
        email: email ?? null,
        displayName: byEmail.displayName?.trim() || displayName?.trim() || null,
      },
      include: accountInclude,
    });
    return resolveLinkedAccount(account, email, displayName, createIfMissing);
  }

  if (!createIfMissing) {
    return { account: null, hadPlatformAccount: false };
  }

  const account = await createPlatformUserAccount(clerkId, email, displayName);

  return { account, hadPlatformAccount: false };
}

/** Fetch the Maxime UserAccount row without creating one. */
export async function getExistingUserAccount() {
  const clerkId = await requireClerkId();
  return db.userAccount.findUnique({
    where: { clerkId },
    include: accountInclude,
  });
}

/** Like getExistingUserAccount, but ignores blank shell rows left from sign-in attempts. */
export async function getMeaningfulUserAccount() {
  const account = await getExistingUserAccount();
  if (!account || !isMeaningfulMaximeAccount(account)) return null;
  return account;
}

/**
 * Get or create the Maxime UserAccount row for the signed-in Clerk user.
 * Deduplicated per request via React cache(). Existing users skip the Clerk API.
 */
export const getOrCreateUserAccount = cache(async function getOrCreateUserAccount() {
  const clerkId = await requireClerkId();

  // Fast path: an existing, meaningful account needs only one DB query.
  // Skips the Clerk identity round-trip and the by-email reconcile lookup,
  // which matters a lot when the database is geographically distant.
  const existing = await db.userAccount.findUnique({
    where: { clerkId },
    include: accountInclude,
  });
  if (existing && isMeaningfulMaximeAccount(existing)) {
    return existing;
  }

  // Slow path: blank shell or no row — fetch Clerk identity to create/link.
  const { email, displayName } = await clerkIdentity();
  const { account } = await reconcileUserAccount(clerkId, email, displayName, {
    preloadedByClerkId: existing,
  });
  if (!account) {
    throw new Error("NO_PLATFORM_ACCOUNT");
  }
  return account;
});

/** Used after Clerk auth to detect first-time platform users vs returning ones. */
export async function resolveUserAccountOnAuth(options?: {
  createIfMissing?: boolean;
}) {
  const clerkId = await requireClerkId();
  const { email, displayName } = await clerkIdentity();
  return reconcileUserAccount(clerkId, email, displayName, options);
}

/** Ensures a UserAccount exists before onboarding API writes (creates if missing). */
export async function requireOnboardingUserAccount() {
  const { account } = await resolveUserAccountOnAuth({ createIfMissing: true });
  if (!account) {
    throw new Error("NO_PLATFORM_ACCOUNT");
  }
  return account;
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

/** Whether the user has already seen the dashboard overview welcome. */
export async function getHasWelcomedToDashboard(userId: string): Promise<boolean> {
  const rows = await db.$queryRaw<Array<{ hasWelcomedToDashboard: boolean }>>`
    SELECT "hasWelcomedToDashboard"
    FROM "UserAccount"
    WHERE "id" = ${userId}
    LIMIT 1
  `;
  return rows[0]?.hasWelcomedToDashboard ?? false;
}

/** Marks the overview welcome as seen — call from `/dashboard` on first visit. */
export async function markDashboardWelcomed(userId: string) {
  await db.$executeRaw`
    UPDATE "UserAccount"
    SET "hasWelcomedToDashboard" = true, "updatedAt" = NOW()
    WHERE "id" = ${userId}
  `;
}

export async function getOnboardingStatus() {
  const account = await getExistingUserAccount();
  if (!account) {
    throw new Error("NO_PLATFORM_ACCOUNT");
  }

  const synced = await syncOnboardingCompleteFlag(account);
  return {
    accountType: account.accountType,
    accountTier: account.accountTier,
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

/** Navbar / client checks — never creates a UserAccount row. */
export async function getOnboardingStatusReadOnly() {
  const account = await getExistingUserAccount();
  if (!account) {
    return {
      accountType: null,
      accountTier: null,
      onboardingComplete: false,
      hasTeam: false,
      hasPlayerProfile: false,
      team: null,
      membershipRole: null,
      playerProfile: null,
      displayName: null,
      email: null,
    };
  }

  const synced = await syncOnboardingCompleteFlag(account);
  return {
    accountType: synced.accountType,
    accountTier: synced.accountTier,
    onboardingComplete: synced.onboardingComplete,
    hasTeam: !!synced.membership,
    hasPlayerProfile: !!synced.playerProfile,
    team: synced.membership?.team ?? null,
    membershipRole: synced.membership?.role ?? null,
    playerProfile: synced.playerProfile,
    displayName: synced.displayName,
    email: synced.email,
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

/** Full account context for the signed-in app dashboard (deduplicated per request). */
export const getDashboardContext = cache(async function getDashboardContext() {
  const account = await syncOnboardingCompleteFlag(await getOrCreateUserAccount());
  const team = account.membership?.team ?? null;
  const hasWelcomedToDashboard = await getHasWelcomedToDashboard(account.id);

  let teamWithMeta = null;
  if (team) {
    const memberCount = await db.teamMembership.count({
      where: { teamId: team.id, status: "active" },
    });
    teamWithMeta = {
      id: team.id,
      name: team.name,
      school: team.school,
      institutionId: team.institutionId,
      accountTier: team.accountTier,
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
    userId: account.id,
    displayName: account.displayName,
    email: account.email,
    accountType: account.accountType,
    accountTier: account.accountTier,
    onboardingComplete: account.onboardingComplete,
    hasWelcomedToDashboard,
    managerTitle: account.managerTitle,
    managerOrgEmail: account.managerOrgEmail,
    managerVerificationStatus: account.managerVerificationStatus,
    team: teamWithMeta,
    membershipRole: account.membership?.role ?? null,
    playerProfile: account.playerProfile,
  };
});
