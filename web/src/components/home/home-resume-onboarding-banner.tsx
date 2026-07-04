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
  const { showDashboard, degraded, isLoaded: statusLoaded } =
    useOnboardingComplete();
  const searchParams = useSearchParams();
  const browsing = searchParams.get(MARKETING_BROWSE_PARAM) === "1";

  if (!isLoaded || !isSignedIn || !browsing || !statusLoaded) return null;

  if (showDashboard) {
    return (
      <div className="border-b border-cyan-400/20 bg-cyan-400/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm text-cyan-100/90">
            You&apos;re signed in. Head to your dashboard or keep browsing.
          </p>
          <Button href="/dashboard" size="sm" className="gap-1.5" prefetch={false}>
            Go to dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  if (degraded) {
    return (
      <div className="border-b border-amber-400/20 bg-amber-400/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm text-amber-100/90">
            You&apos;re signed in, but we couldn&apos;t verify your account right
            now. The database may be temporarily unavailable — try again in about a
            minute.{" "}
            <Link
              href="https://status.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline-offset-2 transition-colors hover:text-cyan-300 hover:underline"
            >
              Check Supabase status
            </Link>
            .
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button href="/dashboard" size="sm" className="gap-1.5" prefetch={false}>
              Try dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Link
              href="/auth/continue?intent=sign-in"
              prefetch={false}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Retry sign-in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-cyan-400/20 bg-cyan-400/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="text-sm text-cyan-100/90">
          You&apos;re signed in. Finish onboarding anytime, or keep browsing the
          site.
        </p>
        <Button href="/onboarding" size="sm" className="gap-1.5" prefetch={false}>
          Continue onboarding
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
