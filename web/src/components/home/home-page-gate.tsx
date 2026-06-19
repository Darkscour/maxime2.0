"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthRedirectShell } from "@/components/auth/auth-redirect-shell";
import { authContinuePath } from "@/lib/auth-intent";

/**
 * Prevents signed-in users from seeing a blank marketing shell while the
 * server session cookie catches up after OAuth (common on cross-browser sign-up).
 */
export function HomePageGate({
  browsing,
  children,
}: {
  browsing: boolean;
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || browsing || !isSignedIn) return;

    router.replace(authContinuePath("sign-in"));
  }, [browsing, isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <AuthRedirectShell />;
  }

  if (isSignedIn && !browsing) {
    return <AuthRedirectShell />;
  }

  return <>{children}</>;
}

