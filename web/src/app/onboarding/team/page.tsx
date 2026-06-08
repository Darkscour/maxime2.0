import { Suspense } from "react";
import {
  enforceOnboardingRoute,
  isOnboardingReviseMode,
  isOnboardingTestMode,
} from "@/lib/onboarding-guards";
import { TeamOnboardingForm } from "./team-onboarding-form";

export const dynamic = "force-dynamic";

export default async function TeamOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string; revise?: string }>;
}) {
  const params = await searchParams;
  await enforceOnboardingRoute("/onboarding/team", {
    testMode: isOnboardingTestMode(params),
    reviseMode: isOnboardingReviseMode(params),
  });
  return (
    <Suspense fallback={null}>
      <TeamOnboardingForm />
    </Suspense>
  );
}
