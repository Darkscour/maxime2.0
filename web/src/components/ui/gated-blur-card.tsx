"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  redirectUrl = "/sign-in",
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
  const href = signUpFlow ? "/sign-up" : "/sign-in";

  return (
    <div className="relative overflow-hidden border border-[var(--border)]">
      <div
        className="pointer-events-none select-none blur-[6px] brightness-[0.85] saturate-50"
        aria-hidden
      >
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-[color-mix(in_srgb,var(--background)_72%,transparent)] p-4 backdrop-blur-[1px]">
        <span className="oc-mark">
          <Lock className="h-4 w-4" />
        </span>
        <p className="max-w-[200px] text-center text-xs font-medium leading-5 text-[var(--foreground)] sm:text-sm">
          {message}
        </p>
        <Button href={href} variant="primary" size="sm">
          {ctaLabel}
        </Button>
        {!signUpFlow ? (
          <Link
            href="/sign-up"
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Or get started free
          </Link>
        ) : null}
      </div>
    </div>
  );
}
