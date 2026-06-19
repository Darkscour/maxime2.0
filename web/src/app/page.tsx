import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { HomePageGate } from "@/components/home/home-page-gate";
import { HomePageContent } from "@/components/home/home-page-content";
import { HomeResumeOnboardingBanner } from "@/components/home/home-resume-onboarding-banner";
import { authContinuePath } from "@/lib/auth-intent";
import { MARKETING_BROWSE_PARAM } from "@/lib/onboarding-path";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const browsing = params[MARKETING_BROWSE_PARAM] === "1";
  const { userId } = await auth();

  if (userId && !browsing) {
    redirect(authContinuePath("sign-in"));
  }

  return (
    <HomePageGate browsing={browsing}>
      <Suspense fallback={null}>
        <HomeResumeOnboardingBanner />
      </Suspense>
      <HomePageContent />
    </HomePageGate>
  );
}
