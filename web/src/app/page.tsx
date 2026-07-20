import { Suspense } from "react";
import { HomePageGate } from "@/components/home/home-page-gate";
import { OvercastHome } from "@/components/home/overcast-home";
import { HomeResumeOnboardingBanner } from "@/components/home/home-resume-onboarding-banner";
import { MARKETING_BROWSE_PARAM } from "@/lib/onboarding-path";

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const browsing = params[MARKETING_BROWSE_PARAM] === "1";
  const initialSolution = firstParam(params.solution);

  // Signed-in users on `/` are routed by middleware to `/auth/continue` unless
  // `?browse=1`. HomePageGate handles the brief client-side OAuth lag case.
  // OvercastHome must not sit behind Suspense fallback={null}: that empties the
  // static shell and breaks browser scroll restoration on reload.
  return (
    <HomePageGate browsing={browsing}>
      <Suspense fallback={null}>
        <HomeResumeOnboardingBanner />
      </Suspense>
      <OvercastHome initialSolution={initialSolution} />
    </HomePageGate>
  );
}
