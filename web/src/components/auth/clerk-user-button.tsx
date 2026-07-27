"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";
import { useDashboardTheme } from "@/hooks/use-dashboard-theme";

/** Avoid Clerk UserButton SSR/client hydration mismatches. */
export function ClerkUserButton({
  avatarClassName = "h-9 w-9 ring-1 ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]",
  syncDashboardTheme = false,
}: {
  avatarClassName?: string;
  /** Popover follows dashboard light/dark when rendered in dashboard shell. */
  syncDashboardTheme?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, ready: themeReady } = useDashboardTheme();
  const isDark = syncDashboardTheme && themeReady && theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="inline-flex shrink-0 items-center md-clerk-user-btn">
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
              colorBackground: isDark ? "#1c1c22" : "#ffffff",
              colorText: isDark ? "#f2f2f5" : undefined,
              colorTextSecondary: isDark ? "#a8acb6" : undefined,
              spacingUnit: "0.65rem",
            },
            elements: {
              avatarBox: cn(avatarClassName, "!rounded-full !overflow-hidden"),
              userButtonPopoverCard: "md-clerk-user-popover",
              userButtonPopoverMain: "md-clerk-user-popover-main",
              userPreview: "md-clerk-user-preview",
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
