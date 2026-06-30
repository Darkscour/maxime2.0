"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { AuthRedirectShell } from "@/components/auth/auth-redirect-shell";
import { RouteErrorRecovery } from "@/components/auth/route-error-recovery";

export default function AuthContinueError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    window.location.replace("/auth/no-maxime-account");
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || isSignedIn) {
    return <AuthRedirectShell />;
  }

  return (
    <RouteErrorRecovery
      title="Couldn't finish sign-in"
      description="We couldn't finish routing your session. Try again or browse the homepage."
      retryHref="/auth/continue?intent=sign-in"
      secondaryHref="/?browse=1"
      secondaryLabel="View homepage"
      reset={reset}
    />
  );
}
