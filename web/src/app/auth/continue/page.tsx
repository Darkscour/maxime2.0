import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getMeaningfulUserAccount,
  getReconcileLogContext,
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
import { isTransientDbError } from "@/lib/db-retry";
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
  try {
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
        hasPlatformShell: false,
      });
      console.info("[auth/continue] unregistered sign-in", {
        target,
        hadShell: !!account,
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
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;

    const { userId } = await auth();
    let reconcileContext: Awaited<ReturnType<typeof getReconcileLogContext>> | null =
      null;
    if (userId) {
      try {
        reconcileContext = await getReconcileLogContext(userId, undefined, false);
      } catch (contextError) {
        console.warn("[auth/continue] could not load reconcile context", contextError);
      }
    }

    const prismaCode =
      error instanceof Error && "code" in error
        ? String((error as { code?: unknown }).code)
        : undefined;

    console.error("[auth/continue] failed to resolve post-auth route", {
      error: error instanceof Error ? error.message : String(error),
      prismaCode,
      transient: isTransientDbError(error),
      reconcileContext,
    });
    throw error;
  }
}

/** Clerk lands here after sign-in / sign-up; we route to onboarding or dashboard. */
export default async function AuthContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; maxime_signup?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const target = await resolveAuthContinueTarget(searchParams);

  // redirect() must run outside try/catch so Next.js control-flow throws propagate.
  redirect(target);
}
