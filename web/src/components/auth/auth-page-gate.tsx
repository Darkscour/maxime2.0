"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthRedirectShell } from "@/components/auth/auth-redirect-shell";
import { authContinuePath, type AuthIntent } from "@/lib/auth-intent";

/**
 * After OAuth, Clerk may leave signed-in users on /sign-up/sso-callback with an
 * empty SignUp shell while the server session catches up. Redirect them to our
 * post-auth router instead of showing a blank page.
 */
export function AuthPageGate({
  intent,
  skipSignedInRedirect = false,
  children,
}: {
  intent: AuthIntent;
  skipSignedInRedirect?: boolean;
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || skipSignedInRedirect) return;
    router.replace(authContinuePath(intent));
  }, [intent, isLoaded, isSignedIn, router, skipSignedInRedirect]);

  if (!isLoaded) {
    return <AuthRedirectShell />;
  }

  if (isSignedIn) {
    return <AuthRedirectShell />;
  }

  return <>{children}</>;
}
