import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
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

/** Clerk lands here after sign-in / sign-up; we route to onboarding or dashboard. */
export default async function AuthContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; maxime_signup?: string }>;
}) {
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

    redirect(
      resolvePostAuthPath({
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
      }),
    );
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

  redirect(
    resolvePostAuthPath({
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
    }),
  );
}
