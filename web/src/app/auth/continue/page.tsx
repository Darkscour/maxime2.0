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
  redirect(
    resolvePostAuthPath({
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
    }),
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
      redirect(
        pathForUnregisteredSession({
          sessionIntent: "sign-in",
          hasPlatformShell: !!account,
        }),
      );
    }

    const synced = await syncOnboardingCompleteFlag(account);
    postAuthRedirect("sign-in", synced, hadPlatformAccount);
  } catch (error) {
    console.error("[auth/continue]", error);
    redirect("/sign-in");
  }
}
