import { Suspense } from "react";
import {
  enforceOnboardingRoute,
  isOnboardingTestMode,
} from "@/lib/onboarding-guards";
import { JoinTeamForm } from "./join-team-form";

export const dynamic = "force-dynamic";

export default async function JoinTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string }>;
}) {
  const params = await searchParams;
  await enforceOnboardingRoute("/onboarding/join", {
    testMode: isOnboardingTestMode(params),
  });
  return (
    <Suspense fallback={null}>
      <JoinTeamForm />
    </Suspense>
  );
}
