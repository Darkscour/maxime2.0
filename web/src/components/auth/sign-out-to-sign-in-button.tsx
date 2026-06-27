"use client";

import { ClerkSignOutButton } from "@/components/auth/clerk-sign-out-button";

export function SignOutToSignInButton() {
  return (
    <ClerkSignOutButton
      redirectUrl="/sign-in"
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-zinc-700 px-5 text-sm font-medium text-zinc-200 transition-all hover:border-cyan-400/60 hover:bg-cyan-400/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
    >
      Back to sign in
    </ClerkSignOutButton>
  );
}
