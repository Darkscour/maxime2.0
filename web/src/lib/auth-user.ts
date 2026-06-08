import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function requireClerkId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");
  return userId;
}

/** Get or create the Maxime UserAccount row for the signed-in Clerk user. */
export async function getOrCreateUserAccount() {
  const clerkId = await requireClerkId();
  const clerkUser = await currentUser();

  const existing = await db.userAccount.findUnique({
    where: { clerkId },
    include: {
      membership: { include: { team: true } },
      playerProfile: true,
    },
  });

  if (existing) return existing;

  const email =
    clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ?? clerkUser?.emailAddresses[0]?.emailAddress;

  const displayName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    undefined;

  return db.userAccount.create({
    data: {
      clerkId,
      email,
      displayName,
    },
    include: {
      membership: { include: { team: true } },
      playerProfile: true,
    },
  });
}

export async function getOnboardingStatus() {
  const account = await getOrCreateUserAccount();
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

/** Full account context for the signed-in app dashboard. */
export async function getDashboardContext() {
  const account = await getOrCreateUserAccount();
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
      avgViewers: team.avgViewers,
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
    team: teamWithMeta,
    membershipRole: account.membership?.role ?? null,
    playerProfile: account.playerProfile,
  };
}
