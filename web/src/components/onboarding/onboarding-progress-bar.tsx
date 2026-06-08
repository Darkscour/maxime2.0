"use client";

import { usePathname } from "next/navigation";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";

export function OnboardingProgressBar() {
  const pathname = usePathname();
  return <OnboardingProgress pathname={pathname} />;
}
