"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MARKETING_BROWSE_PARAM } from "@/lib/onboarding-path";
import { Button } from "@/components/ui/button";
import { useOnboardingComplete } from "@/hooks/use-onboarding-complete";

export function HomeResumeOnboardingBanner() {
  const { isSignedIn, isLoaded } = useAuth();
  const { showDashboard } = useOnboardingComplete();
  const searchParams = useSearchParams();
  const browsing = searchParams.get(MARKETING_BROWSE_PARAM) === "1";

  if (!isLoaded || !isSignedIn || !browsing) return null;

  return (
    <div className="border-b border-cyan-400/20 bg-cyan-400/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="text-sm text-cyan-100/90">
          You&apos;re signed in. Finish onboarding anytime, or keep browsing the site.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button href="/onboarding" size="sm" className="gap-1.5">
            Continue onboarding
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          {showDashboard ? (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
