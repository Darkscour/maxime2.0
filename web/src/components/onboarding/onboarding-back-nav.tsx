"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  buildOnboardingHref,
  onboardingQueryFromSearchParams,
} from "@/lib/onboarding-path";

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
  const searchParams = useSearchParams();
  const query = onboardingQueryFromSearchParams(searchParams);
  const dest = buildOnboardingHref(href, {
    test: query.test,
    revise: revise || query.revise,
  });

  return (
    <Link
      href={dest}
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
