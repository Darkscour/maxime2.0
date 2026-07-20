"use client";

import { ClerkSignOutButton } from "@/components/auth/clerk-sign-out-button";

export function SignOutToSignInButton() {
  return (
    <ClerkSignOutButton
      redirectUrl="/sign-in"
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-none border border-[var(--border)] px-5 text-sm font-medium text-[var(--foreground)] transition-all hover:border-[var(--foreground)] hover:bg-[var(--background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_50%,transparent)]"
    >
      Back to sign in
    </ClerkSignOutButton>
  );
}
