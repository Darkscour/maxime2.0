import { Suspense } from "react";
import {
  enforceOnboardingRoute,
  isOnboardingReviseMode,
  isOnboardingTestMode,
} from "@/lib/onboarding-guards";
import { PlayerOnboardingForm } from "./player-onboarding-form";

export const dynamic = "force-dynamic";

export default async function PlayerOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string; revise?: string }>;
}) {
  const params = await searchParams;
  await enforceOnboardingRoute("/onboarding/player", {
    testMode: isOnboardingTestMode(params),
    reviseMode: isOnboardingReviseMode(params),
  });
  return (
    <Suspense fallback={null}>
      <PlayerOnboardingForm />
    </Suspense>
  );
}
