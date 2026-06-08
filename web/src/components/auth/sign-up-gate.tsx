"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Ensures /sign-up starts fresh: signs out any existing Clerk session so
 * Google OAuth can show the account picker instead of auto-using the last login.
 */
export function SignUpGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const isOAuthCallback =
      pathname.includes("sso-callback") ||
      pathname.includes("verify-email-address") ||
      pathname.includes("continue") ||
      searchParams.has("__clerk_status") ||
      searchParams.has("__clerk_ticket");

    if (isSignedIn && pathname === "/sign-up" && !isOAuthCallback) {
      void signOut({ redirectUrl: "/sign-up" }).finally(() => setReady(true));
      return;
    }

    setReady(true);
  }, [isLoaded, isSignedIn, pathname, searchParams, signOut]);

  if (!isLoaded || !ready) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-zinc-500">
        Preparing sign up…
      </div>
    );
  }

  return <>{children}</>;
}
