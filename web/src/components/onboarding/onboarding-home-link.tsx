import Link from "next/link";
import { buildMarketingHomeHref } from "@/lib/onboarding-path";

export function OnboardingHomeLink({ className }: { className?: string }) {
  return (
    <Link href={buildMarketingHomeHref()} className={className}>
      Back to homepage →
    </Link>
  );
}
