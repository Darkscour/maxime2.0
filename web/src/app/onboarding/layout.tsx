import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { AuthNoticeBanner } from "@/components/auth/auth-notice-banner";
import { OnboardingProgressBar } from "@/components/onboarding/onboarding-progress-bar";
import { getOnboardingStatus } from "@/lib/auth-user";
import { deriveOnboardingComplete } from "@/lib/onboarding-complete";

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
  const search =
    headerStore.get("x-search") ??
    new URL(headerStore.get("x-url") ?? "http://local/onboarding", "http://local")
      .search;
  const { testMode, reviseMode } = parseOnboardingModes(search);

  if (!testMode && !reviseMode) {
    const status = await getOnboardingStatus();
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
  }

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-1 flex-col border-b border-white/5 bg-spotlight py-10 sm:py-14">
      <Container className="max-w-2xl">
        <Suspense fallback={null}>
          <AuthNoticeBanner />
        </Suspense>
        <OnboardingProgressBar />
        <Suspense fallback={null}>{children}</Suspense>
      </Container>
    </div>
  );
}
