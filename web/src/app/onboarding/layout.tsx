import { auth } from "@clerk/nextjs/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { AuthNoticeBanner } from "@/components/auth/auth-notice-banner";
import { OnboardingProgressBar } from "@/components/onboarding/onboarding-progress-bar";
import { OnboardingResumeBanner } from "@/components/onboarding/onboarding-resume-banner";
import {
  getExistingUserAccount,
  syncOnboardingCompleteFlag,
} from "@/lib/auth-user";
import {
  AUTH_INTENT_COOKIE,
  hasMaximeSignupPending,
  parseSessionAuthIntent,
  pathForUnregisteredSession,
} from "@/lib/auth-intent";
import { deriveOnboardingComplete } from "@/lib/onboarding-complete";
import { hasOnboardingProgress } from "@/lib/onboarding-resume";
import { syncOnboardingCheckpoint } from "@/lib/persist-onboarding-progress";

function parseOnboardingModes(search: string) {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return {
    testMode: params.get("test") === "1",
    reviseMode: params.get("revise") === "1",
  };
}

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/onboarding");

  const headerStore = await headers();
  const requestUrl = headerStore.get("x-url") ?? "http://local/onboarding";
  const parsedUrl = new URL(requestUrl, "http://local");
  const pathname = parsedUrl.pathname;
  const search =
    headerStore.get("x-search") && headerStore.get("x-search") !== ""
      ? headerStore.get("x-search")!
      : parsedUrl.search;
  const { testMode, reviseMode } = parseOnboardingModes(search);

  let showResumeBanner = false;

  if (!testMode && !reviseMode) {
    const searchParams = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search,
    );
    const cookieStore = await cookies();
    const sessionIntent = parseSessionAuthIntent(
      cookieStore.get(AUTH_INTENT_COOKIE)?.value,
    );

    const existing = await getExistingUserAccount();
    if (!existing) {
      redirect(
        pathForUnregisteredSession({
          sessionIntent,
          signupPending: hasMaximeSignupPending(searchParams),
        }),
      );
    }

    const checkpointAccount =
      (await syncOnboardingCheckpoint(pathname, search)) ?? existing;
    const synced = await syncOnboardingCompleteFlag(checkpointAccount);
    const status = {
      accountType: synced.accountType,
      accountTier: synced.accountTier,
      onboardingComplete: synced.onboardingComplete,
      hasTeam: !!synced.membership,
      hasPlayerProfile: !!synced.playerProfile,
      team: synced.membership?.team ?? null,
      membershipRole: synced.membership?.role ?? null,
      playerProfile: synced.playerProfile,
    };
    const complete = deriveOnboardingComplete({
      accountType: status.accountType,
      onboardingComplete: status.onboardingComplete,
      membership: status.hasTeam
        ? { role: status.membershipRole ?? "player", teamId: status.team!.id }
        : null,
      playerProfile: status.hasPlayerProfile
        ? { id: status.playerProfile!.id }
        : null,
    });

    if (complete) {
      redirect("/dashboard");
    }

    showResumeBanner = hasOnboardingProgress({
      accountType: status.accountType,
      accountTier: status.accountTier,
      hasTeam: status.hasTeam,
      hasPlayerProfile: status.hasPlayerProfile,
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-1 flex-col border-b border-white/5 bg-spotlight py-10 sm:py-14">
      <Container className="max-w-2xl">
        <OnboardingResumeBanner show={showResumeBanner} />
        {!showResumeBanner ? (
          <Suspense fallback={null}>
            <AuthNoticeBanner />
          </Suspense>
        ) : null}
        <OnboardingProgressBar />
        <Suspense fallback={null}>{children}</Suspense>
      </Container>
    </div>
  );
}
