"use client";

import { SignUp } from "@clerk/nextjs";
import { clerkSignUpAppearance } from "@/lib/clerk-appearance";
import { GoogleSignUpButton } from "@/components/auth/google-sign-up-button";

export function SignUpPanel() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <GoogleSignUpButton />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          or sign up with email
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="sign-up-clerk-panel">
        <SignUp
          forceRedirectUrl="/auth/continue?intent=sign-up"
          signInForceRedirectUrl="/auth/continue?intent=sign-in"
          appearance={clerkSignUpAppearance}
          routing="path"
          path="/sign-up"
          oidcPrompt="select_account"
        />
      </div>
    </div>
  );
}
