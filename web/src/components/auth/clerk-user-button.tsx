"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

/** Avoid Clerk UserButton SSR/client hydration mismatches. */
export function ClerkUserButton({
  avatarClassName = "h-9 w-9 ring-1 ring-cyan-400/30",
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
        className={cn("inline-block shrink-0 rounded-full bg-white/10", avatarClassName)}
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
