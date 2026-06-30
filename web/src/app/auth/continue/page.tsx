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
import { resolvePostAuthPath } from "@/lib/post-auth";

export const dynamic = "force-dynamic";

function postAuthRedirect(
  intent: "sign-in" | "sign-up",
  synced: Awaited<ReturnType<typeof syncOnboardingCompleteFlag>>,
  hadPlatformAccount: boolean,
) {
  const target = resolvePostAuthPath({
    intent,
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
  console.info("[auth/continue] resolved", {
    intent,
    target,
    accountType: synced.accountType,
    onboardingComplete: synced.onboardingComplete,
    hasTeam: !!synced.membership,
    hasPlayerProfile: !!synced.playerProfile,
  });
  redirect(
    target,
  );
}

/** Clerk lands here after sign-in / sign-up; we route to onboarding or dashboard. */
export default async function AuthContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; maxime_signup?: string }>;
}) {
  try {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

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
        redirect(appendMaximeSignupPending("/onboarding"));
      }

      const synced = await syncOnboardingCompleteFlag(account);
      postAuthRedirect("sign-up", synced, hadPlatformAccount);
    }

    // Sign-in fast path: existing meaningful account needs only DB, no Clerk round-trip.
    const existing = await getMeaningfulUserAccount();
    if (existing) {
      const synced = await syncOnboardingCompleteFlag(existing);
      postAuthRedirect("sign-in", synced, true);
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
      redirect(
        target,
      );
    }

    const synced = await syncOnboardingCompleteFlag(account);
    postAuthRedirect("sign-in", synced, hadPlatformAccount);
  } catch (error) {
    // redirect()/notFound() signal navigation by throwing — never swallow them,
    // or the page gets stuck in a reload loop.
    if (isNextControlFlowError(error)) throw error;
    console.error("[auth/continue] failed to resolve post-auth route", error);
    throw error;
  }
}

/** True for Next.js redirect()/notFound() control-flow throws, which must propagate. */
function isNextControlFlowError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const digest = (error as { digest?: unknown }).digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") ||
      digest === "NEXT_NOT_FOUND" ||
      digest.startsWith("NEXT_HTTP_ERROR_FALLBACK"))
  );
}
