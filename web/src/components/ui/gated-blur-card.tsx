"use client";

import { Lock } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

export const PUBLIC_PORTAL_CARD_LIMIT = 4;

/** Cap list length for public previews; last item is intended for blur gate. */
export function capForPublicPreview<T>(items: T[], limit = PUBLIC_PORTAL_CARD_LIMIT) {
  return items.slice(0, limit);
}

function isSignUpDestination(url: string) {
  return url === "/sign-up" || url.includes("intent=sign-up");
}

export function GatedBlurCard({
  children,
  gated,
  redirectUrl = "/auth/continue?intent=sign-in",
  message = "Sign in to unlock the full directory",
  ctaLabel = "Sign up free",
}: {
  children: React.ReactNode;
  gated: boolean;
  redirectUrl?: string;
  message?: string;
  ctaLabel?: string;
}) {
  if (!gated) {
    return <>{children}</>;
  }

  const signUpFlow = isSignUpDestination(redirectUrl);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="pointer-events-none select-none blur-[6px] brightness-[0.55] saturate-50"
        aria-hidden
      >
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-zinc-950/50 p-4 backdrop-blur-[1px]">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/15">
          <Lock className="h-4 w-4 text-zinc-200" />
        </span>
        <p className="max-w-[200px] text-center text-xs font-medium leading-5 text-white sm:text-sm">
          {message}
        </p>
        {signUpFlow ? (
          <Button href="/sign-up" variant="primary" size="sm">
            {ctaLabel}
          </Button>
        ) : (
          <SignInButton
            mode="modal"
            forceRedirectUrl={redirectUrl}
            appearance={clerkAuthAppearance}
          >
            <Button variant="primary" size="sm">
              {ctaLabel}
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
