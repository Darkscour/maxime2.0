"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

/**
 * Avoid Clerk UserButton SSR/client hydration mismatches.
 * Popover colors follow `--md-card` / `--surface` / `--foreground` on `<html>`
 * (set by home + dashboard theme hooks).
 */
export function ClerkUserButton({
  avatarClassName = "h-8 w-8 ring-1 ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]",
  // Kept for call-site clarity; theme is applied via document CSS variables.
  syncDashboardTheme: _syncDashboardTheme = false,
  popoverTheme: _popoverTheme,
}: {
  avatarClassName?: string;
  /** Popover follows dashboard light/dark when rendered in dashboard shell. */
  syncDashboardTheme?: boolean;
  /** When set, documents that popover should match this theme (home FrameNav). */
  popoverTheme?: "light" | "dark";
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="inline-flex shrink-0 items-center leading-none md-clerk-user-btn">
      {!mounted ? (
        <span
          aria-hidden
          className={cn("inline-block rounded-full bg-[var(--surface-2)]", avatarClassName)}
        />
      ) : (
        <UserButton
          appearance={{
            variables: {
              ...clerkAuthAppearance.variables,
              colorBackground: "var(--md-card, var(--surface))",
              colorText: "var(--foreground)",
              colorTextSecondary: "var(--foreground-muted)",
              colorNeutral: "var(--foreground)",
              borderRadius: "10px",
              spacingUnit: "0.65rem",
            },
            elements: {
              rootBox: "flex items-center justify-center leading-none",
              userButtonBox: "flex items-center justify-center leading-none",
              userButtonTrigger:
                "!m-0 !flex !h-8 !w-8 !items-center !justify-center !rounded-full !p-0 !leading-none focus:shadow-none",
              avatarBox: cn(
                avatarClassName,
                "!flex !items-center !justify-center !overflow-hidden !rounded-full !leading-none",
              ),
              userButtonAvatarBox:
                "!flex !h-full !w-full !items-center !justify-center !overflow-hidden !rounded-full",
              userButtonAvatarImage: "!h-full !w-full !object-cover !object-center",
              userButtonPopoverCard: "md-clerk-user-popover",
              userButtonPopoverMain: "md-clerk-user-popover-main",
              userPreview: "md-clerk-user-preview",
              userPreviewAvatarBox:
                "!flex !h-10 !w-10 !shrink-0 !items-center !justify-center !overflow-hidden !rounded-full",
              userPreviewAvatarImage: "!h-full !w-full !object-cover !object-center",
              userButtonPopoverActions: "!p-1 !pt-0 !pb-1 !gap-0",
              userButtonPopoverActionButton: "md-clerk-user-popover-action",
              userButtonPopoverFooter:
                "!hidden !h-0 !min-h-0 !max-h-0 !p-0 !m-0 !overflow-hidden !border-0",
              footer: "!hidden !h-0 !min-h-0 !max-h-0 !p-0 !m-0 !overflow-hidden !border-0",
              footerPages: "!hidden",
              userProfileFooter: "!hidden",
            },
          }}
        />
      )}
    </div>
  );
}
