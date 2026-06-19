"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildMarketingHomeHref } from "@/lib/onboarding-path";
import { recordOnboardingCheckpoint } from "@/lib/onboarding-checkpoint-client";

export function OnboardingHomeLink({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const search = searchParams.toString();
    const currentPath = search ? `${pathname}?${search}` : pathname;

    try {
      await recordOnboardingCheckpoint(currentPath);
    } catch {
      // Continue navigation even if checkpoint sync fails.
    }

    router.push(buildMarketingHomeHref());
  }

  return (
    <Link href={buildMarketingHomeHref()} onClick={handleClick} className={className}>
      Back to homepage →
    </Link>
  );
}
