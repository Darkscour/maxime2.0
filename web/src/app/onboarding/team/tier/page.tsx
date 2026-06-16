import {
  enforceOnboardingRoute,
  isOnboardingReviseMode,
  isOnboardingTestMode,
} from "@/lib/onboarding-guards";
import { buildOnboardingHref } from "@/lib/onboarding-path";
import { AccountTierSelection } from "@/components/onboarding/account-tier-selection";
import { OnboardingHomeLink } from "@/components/onboarding/onboarding-home-link";

export const dynamic = "force-dynamic";

export default async function TeamTierOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string; revise?: string }>;
}) {
  const params = await searchParams;
  const testMode = isOnboardingTestMode(params);
  const reviseMode = isOnboardingReviseMode(params);
  await enforceOnboardingRoute("/onboarding/team/tier", {
    testMode,
    reviseMode,
  });

  const query = { test: testMode, revise: reviseMode };

  return (
    <div>
      <AccountTierSelection
        role="team_manager"
        backHref={buildOnboardingHref("/onboarding", query)}
        backLabel="Back to role selection"
        collegiateHref={buildOnboardingHref("/onboarding/team", {
          ...query,
          tier: "collegiate",
        })}
        grassrootsHref={buildOnboardingHref("/onboarding/team", {
          ...query,
          tier: "grassroots",
        })}
      />

      <p className="mt-8 text-center text-sm text-zinc-500">
        Not ready to finish?{" "}
        <OnboardingHomeLink className="text-cyan-400 hover:text-cyan-300" />
      </p>
    </div>
  );
}
