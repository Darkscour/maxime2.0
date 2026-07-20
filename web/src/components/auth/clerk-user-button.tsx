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

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn("inline-block shrink-0 rounded-none bg-[var(--surface-2)]", avatarClassName)}
      />
    );
  }

  return (
    <UserButton
      appearance={{
        ...clerkAuthAppearance,
        elements: {
          ...(clerkAuthAppearance as { elements?: Record<string, string> }).elements,
          avatarBox: avatarClassName,
        },
      }}
    />
  );
}
