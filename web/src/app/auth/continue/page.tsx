import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getMeaningfulUserAccount,
  isMeaningfulMaximeAccount,
  resolveUserAccountOnAuth,
  syncOnboardingCompleteFlag,
} from "@/lib/auth-user";
import {
  AUTH_INTENT_COOKIE,
  appendMaximeSignupPending,
  hasMaximeSignupConfirm,
  parseAuthIntent,
  parseSessionAuthIntent,
  pathForUnregisteredSession,
  resolveEffectiveAuthIntent,
} from "@/lib/auth-intent";
import { isNextControlFlowError } from "@/lib/next-control-flow";
import { resolvePostAuthPath } from "@/lib/post-auth";

export const dynamic = "force-dynamic";

function logResolvedRoute(
  intent: "sign-in" | "sign-up",
  target: string,
  synced: Awaited<ReturnType<typeof syncOnboardingCompleteFlag>>,
) {
  console.info("[auth/continue] resolved", {
    intent,
    target,
    accountType: synced.accountType,
    onboardingComplete: synced.onboardingComplete,
    hasTeam: !!synced.membership,
    hasPlayerProfile: !!synced.playerProfile,
  });
}

async function resolveAuthContinueTarget(
  searchParams: Promise<{ intent?: string; maxime_signup?: string }>,
): Promise<string> {
  const params = await searchParams;
  const cookieStore = await cookies();
  const sessionIntent = parseSessionAuthIntent(
    cookieStore.get(AUTH_INTENT_COOKIE)?.value,
  );
  const intent = resolveEffectiveAuthIntent(
    parseAuthIntent(params.intent),
    sessionIntent,
    hasMaximeSignupConfirm(params),
  );

  if (intent === "sign-up") {
    const { account, hadPlatformAccount } = await resolveUserAccountOnAuth({
      createIfMissing: true,
    });

    if (!account) {
      return appendMaximeSignupPending("/onboarding");
    }

    const synced = await syncOnboardingCompleteFlag(account);
    const target = resolvePostAuthPath({
      intent: "sign-up",
      hadPlatformAccount,
      accountType: synced.accountType,
      accountTier: synced.accountTier,
      onboardingComplete: synced.onboardingComplete,
      hasTeam: !!synced.membership,
      hasPlayerProfile: !!synced.playerProfile,
      membershipRole: synced.membership?.role ?? null,
      teamId: synced.membership?.teamId,
      playerProfileId: synced.playerProfile?.id,
    });
    logResolvedRoute("sign-up", target, synced);
    return target;
  }

  // Sign-in fast path: existing meaningful account needs only DB, no Clerk round-trip.
  const existing = await getMeaningfulUserAccount();
  if (existing) {
    const synced = await syncOnboardingCompleteFlag(existing);
    const target = resolvePostAuthPath({
      intent: "sign-in",
      hadPlatformAccount: true,
      accountType: synced.accountType,
      accountTier: synced.accountTier,
      onboardingComplete: synced.onboardingComplete,
      hasTeam: !!synced.membership,
      hasPlayerProfile: !!synced.playerProfile,
      membershipRole: synced.membership?.role ?? null,
      teamId: synced.membership?.teamId,
      playerProfileId: synced.playerProfile?.id,
    });
    logResolvedRoute("sign-in", target, synced);
    return target;
  }

  // Sign-in: never create a Maxime profile — only existing users may continue.
  const { account, hadPlatformAccount } = await resolveUserAccountOnAuth({
    createIfMissing: false,
  });

  if (!account || !isMeaningfulMaximeAccount(account)) {
    const target = pathForUnregisteredSession({
      sessionIntent: "sign-in",
      hasPlatformShell: !!account,
    });
    console.info("[auth/continue] unregistered sign-in", {
      target,
      hasPlatformShell: !!account,
    });
    return target;
  }

  const synced = await syncOnboardingCompleteFlag(account);
  const target = resolvePostAuthPath({
    intent: "sign-in",
    hadPlatformAccount,
    accountType: synced.accountType,
    accountTier: synced.accountTier,
    onboardingComplete: synced.onboardingComplete,
    hasTeam: !!synced.membership,
    hasPlayerProfile: !!synced.playerProfile,
    membershipRole: synced.membership?.role ?? null,
    teamId: synced.membership?.teamId,
    playerProfileId: synced.playerProfile?.id,
  });
  logResolvedRoute("sign-in", target, synced);
  return target;
}

/** Clerk lands here after sign-in / sign-up; we route to onboarding or dashboard. */
export default async function AuthContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; maxime_signup?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let target: string;
  try {
    target = await resolveAuthContinueTarget(searchParams);
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;

    console.error("[auth/continue] failed to resolve post-auth route", error);
    target = "/dashboard";
  }

  // redirect() must run outside try/catch so Next.js control-flow throws propagate.
  redirect(target);
}
