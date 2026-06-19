"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  buildOnboardingHref,
  onboardingQueryFromSearchParams,
} from "@/lib/onboarding-path";
import { recordOnboardingCheckpoint } from "@/lib/onboarding-checkpoint-client";

export function OnboardingBackNav({
  href,
  label = "Go back",
  revise,
}: {
  href: string;
  label?: string;
  /** When true, appends revise=1 so profile steps stay accessible after submission. */
  revise?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = onboardingQueryFromSearchParams(searchParams);
  const dest = buildOnboardingHref(href, {
    test: query.test,
    revise: revise || query.revise,
  });

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await recordOnboardingCheckpoint(dest);
    } catch {
      // Continue navigation even if checkpoint sync fails.
    }
    router.push(dest);
  }

  return (
    <Link
      href={dest}
      onClick={handleClick}
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
