"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

/** Avoid Clerk UserButton SSR/client hydration mismatches. */
export function ClerkUserButton({
  avatarClassName = "h-9 w-9 ring-1 ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]",
}: {
  avatarClassName?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="inline-flex shrink-0 items-center">
      {!mounted ? (
        <span
          aria-hidden
          className={cn("inline-block rounded-none bg-[var(--surface-2)]", avatarClassName)}
        />
      ) : (
        <UserButton
          appearance={{
            ...clerkAuthAppearance,
            elements: {
              ...(clerkAuthAppearance as { elements?: Record<string, string> }).elements,
              avatarBox: avatarClassName,
              userButtonPopoverFooter: "!hidden",
              userProfileFooter: "!hidden",
            },
          }}
        />
      )}
    </div>
  );
}
