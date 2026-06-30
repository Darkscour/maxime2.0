import { Suspense } from "react";
import { HomePageGate } from "@/components/home/home-page-gate";
import { HomePageContent } from "@/components/home/home-page-content";
import { HomeResumeOnboardingBanner } from "@/components/home/home-resume-onboarding-banner";
import { MARKETING_BROWSE_PARAM } from "@/lib/onboarding-path";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const browsing = params[MARKETING_BROWSE_PARAM] === "1";

  // Signed-in users on `/` are routed by middleware to `/auth/continue` unless
  // `?browse=1`. HomePageGate handles the brief client-side OAuth lag case.
  return (
    <HomePageGate browsing={browsing}>
      <Suspense fallback={null}>
        <HomeResumeOnboardingBanner />
      </Suspense>
      <HomePageContent />
    </HomePageGate>
  );
}
