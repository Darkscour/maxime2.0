import { Suspense } from "react";
import { HomePageContent } from "@/components/home/home-page-content";
import { HomeResumeOnboardingBanner } from "@/components/home/home-resume-onboarding-banner";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <HomeResumeOnboardingBanner />
      </Suspense>
      <HomePageContent />
    </>
  );
}
