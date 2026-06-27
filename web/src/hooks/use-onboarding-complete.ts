"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { parseJsonResponse } from "@/lib/safe-json";

type OnboardingStatus = {
  signedIn: boolean;
  onboardingComplete?: boolean;
};

/** Whether the signed-in user may access the dashboard (onboarding finished). */
export function useOnboardingComplete() {
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    if (!clerkLoaded) return;

    if (!isSignedIn) {
      setOnboardingComplete(null);
      return;
    }

    let cancelled = false;

    fetch("/api/onboarding/status")
      .then((res) => parseJsonResponse<OnboardingStatus>(res))
      .then((data) => {
        if (cancelled || !data) return;
        setOnboardingComplete(
          data.signedIn ? !!data.onboardingComplete : false,
        );
      })
      .catch(() => {
        if (!cancelled) setOnboardingComplete(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clerkLoaded, isSignedIn]);

  const statusLoaded = !isSignedIn || onboardingComplete !== null;

  return {
    isLoaded: clerkLoaded && statusLoaded,
    showDashboard: isSignedIn && onboardingComplete === true,
  };
}
