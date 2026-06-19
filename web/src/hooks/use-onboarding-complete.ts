"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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
      .then((res) => res.json() as Promise<OnboardingStatus>)
      .then((data) => {
        if (cancelled) return;
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
