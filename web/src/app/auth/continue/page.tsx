import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { resolveUserAccountOnAuth, syncOnboardingCompleteFlag } from "@/lib/auth-user";
import { resolvePostAuthPath, type AuthIntent } from "@/lib/post-auth";

export const dynamic = "force-dynamic";

function parseIntent(value: string | undefined): AuthIntent {
  return value === "sign-up" ? "sign-up" : "sign-in";
}

/** Clerk lands here after sign-in / sign-up; we route to onboarding or dashboard. */
export default async function AuthContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const intent = parseIntent(params.intent);

  const { account, hadPlatformAccount } = await resolveUserAccountOnAuth();
  const synced = await syncOnboardingCompleteFlag(account);

  redirect(
    resolvePostAuthPath({
      intent,
      hadPlatformAccount,
      accountType: synced.accountType,
      onboardingComplete: synced.onboardingComplete,
      hasTeam: !!synced.membership,
      hasPlayerProfile: !!synced.playerProfile,
      membershipRole: synced.membership?.role ?? null,
    }),
  );
}
