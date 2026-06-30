"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { isBenignFetchError } from "@/lib/benign-fetch-error";
import { fetchJson } from "@/lib/safe-json";

type OnboardingStatus = {
  signedIn: boolean;
  onboardingComplete?: boolean;
  hasTeam?: boolean;
  hasPlayerProfile?: boolean;
  degraded?: boolean;
};

function isOnboardingComplete(data: OnboardingStatus): boolean {
  return (
    !!data.onboardingComplete || !!data.hasTeam || !!data.hasPlayerProfile
  );
}

/** Whether the signed-in user may access the dashboard (onboarding finished). */
export function useOnboardingComplete() {
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null,
  );
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    if (!clerkLoaded) return;

    if (!isSignedIn) {
      setOnboardingComplete(null);
      setDegraded(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void fetchJson<OnboardingStatus>("/api/onboarding/status", {
      signal: controller.signal,
    }).then(({ data }) => {
      if (cancelled || !data) return;
      setDegraded(!!data.degraded);
      setOnboardingComplete(
        data.signedIn ? isOnboardingComplete(data) : false,
      );
    }).catch((error) => {
      if (cancelled || isBenignFetchError(error)) return;
      setDegraded(true);
      setOnboardingComplete(null);
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [clerkLoaded, isSignedIn]);

  const statusLoaded = !isSignedIn || onboardingComplete !== null || degraded;

  return {
    isLoaded: clerkLoaded && statusLoaded,
    showDashboard: isSignedIn && onboardingComplete === true,
    degraded,
  };
}
