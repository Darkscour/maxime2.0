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
import { PlayerOnboardingForm } from "./player-onboarding-form";

export const dynamic = "force-dynamic";

export default async function PlayerOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string; revise?: string; tier?: string }>;
}) {
  const params = await searchParams;
  const testMode = isOnboardingTestMode(params);
  const reviseMode = isOnboardingReviseMode(params);
  const status = await enforceOnboardingRoute("/onboarding/player", {
    testMode,
    reviseMode,
  });

  const tierFromQuery = parseAccountTier(params);
  const tierFromAccount = isAccountTier(status.accountTier ?? undefined)
    ? (status.accountTier as AccountTier)
    : null;
  const tierFromProfile = isAccountTier(status.playerProfile?.accountTier ?? undefined)
    ? (status.playerProfile!.accountTier as AccountTier)
    : null;
  const tier = tierFromQuery ?? tierFromAccount ?? tierFromProfile;

  if (!tier) {
    redirect(
      buildOnboardingHref("/onboarding/player/tier", {
        test: testMode,
        revise: reviseMode,
      }),
    );
  }

  return (
    <Suspense fallback={null}>
      <PlayerOnboardingForm tier={tier} signInEmail={status.email} />
    </Suspense>
  );
}
