import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  enforceOnboardingRoute,
  isOnboardingReviseMode,
  isOnboardingTestMode,
} from "@/lib/onboarding-guards";
import { parseAccountTier } from "@/lib/account-tier";
import { isAccountTier } from "@/lib/account-tier";
import type { AccountTier } from "@/lib/account-tier";
import { buildOnboardingHref } from "@/lib/onboarding-path";
import { syncOnboardingCheckpoint } from "@/lib/persist-onboarding-progress";
import { TeamOnboardingForm } from "./team-onboarding-form";

export const dynamic = "force-dynamic";

export default async function TeamOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string; revise?: string; tier?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const testMode = isOnboardingTestMode(params);
  const reviseMode = isOnboardingReviseMode(params);
  const status = await enforceOnboardingRoute("/onboarding/team", {
    testMode,
    reviseMode,
  });

  const tierFromQuery = parseAccountTier(params);
  const tierFromAccount = isAccountTier(status.accountTier ?? undefined)
    ? (status.accountTier as AccountTier)
    : null;
  const tierFromTeam = isAccountTier(status.team?.accountTier ?? undefined)
    ? (status.team!.accountTier as AccountTier)
    : null;
  const tier = tierFromQuery ?? tierFromAccount ?? tierFromTeam;

  if (!tier) {
    redirect(
      buildOnboardingHref("/onboarding/team/tier", {
        test: testMode,
        revise: reviseMode,
        extra: params.notice ? { notice: params.notice } : undefined,
      }),
    );
  }

  await syncOnboardingCheckpoint("/onboarding/team", `?tier=${tier}`);

  return (
    <Suspense fallback={null}>
      <TeamOnboardingForm tier={tier} signInEmail={status.email} />
    </Suspense>
  );
}
