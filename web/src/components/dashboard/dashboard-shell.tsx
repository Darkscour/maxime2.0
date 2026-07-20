"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClerkUserButton } from "@/components/auth/clerk-user-button";
import { ClerkSignOutButton } from "@/components/auth/clerk-sign-out-button";
import { MaximeHomeLogo } from "@/components/brand/maxime-home-logo";
import { DashboardNotifications } from "@/components/dashboard/dashboard-notifications";
import { useDashboardNavBadges } from "@/hooks/use-dashboard-nav-badges";
import {
  getDashboardNavItems,
  type NavItem,
} from "@/lib/dashboard-nav";

export function DashboardShell({
  children,
  accountType,
  accountTier,
  teamName,
  className,
}: {
  children: React.ReactNode;
  accountType: string | null;
  accountTier: string | null;
  teamName?: string | null;
  className?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = getDashboardNavItems(accountType, accountTier);
  const badges = useDashboardNavBadges();

  const tierLabel =
    accountType === "team_manager"
      ? accountTier === "grassroots"
        ? "Grassroots"
        : "Collegiate"
      : accountTier === "grassroots"
        ? "Grassroots player"
        : "Collegiate player";

  return (
    <div className={cn("maxime-desk flex min-h-[calc(100vh-0px)] flex-1 flex-col", className)}>
      <header className="desk-masthead">
        <button
          type="button"
          aria-label="Open menu"
          className="p-2 text-[var(--foreground-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)] lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <MaximeHomeLogo href="/dashboard" className="shrink-0" />
          <span className="hidden text-[var(--border-strong)] sm:inline" aria-hidden>
            ·
          </span>
          <div className="hidden min-w-0 items-baseline gap-2 sm:flex">
            {teamName ? (
              <p className="truncate font-heading text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)]">
                {teamName}
              </p>
            ) : (
              <p className="truncate font-heading text-sm font-semibold text-[var(--foreground)]">
                Your desk
              </p>
            )}
            <span className="desk-kicker !tracking-[0.14em]">{tierLabel}</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <DashboardNotifications />
          <ClerkUserButton avatarClassName="h-8 w-8 ring-1 ring-[var(--border)]" />
        </div>
      </header>

      <nav className="desk-rail hidden lg:flex" aria-label="Desk">
        {navItems.map((item) => (
          <RailLink
            key={item.href}
            item={item}
            active={item.isActive?.(pathname) ?? pathname === item.href}
            badgeCount={item.badgeKey ? badges[item.badgeKey] : 0}
          />
        ))}
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(12,12,14,0.45)] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] flex-col border-r border-[var(--border-strong)] bg-[var(--surface)] transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-strong)] px-4 py-4">
          <MaximeHomeLogo href="/dashboard" />
          <button
            type="button"
            aria-label="Close menu"
            className="p-2 text-[var(--foreground-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="border-b border-[var(--border)] px-4 py-3">
          <p className="desk-kicker">{tierLabel}</p>
          {teamName ? (
            <p className="mt-1 font-heading text-base font-semibold text-[var(--foreground)]">
              {teamName}
            </p>
          ) : null}
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Desk">
          {navItems.map((item) => (
            <RailLink
              key={item.href}
              item={item}
              active={item.isActive?.(pathname) ?? pathname === item.href}
              badgeCount={item.badgeKey ? badges[item.badgeKey] : 0}
              onNavigate={() => setMobileOpen(false)}
              block
            />
          ))}
        </nav>
        <div className="border-t border-[var(--border)] px-3 py-4">
          <ClerkSignOutButton
            redirectUrl="/sign-in"
            onClick={() => setMobileOpen(false)}
            className="w-full px-3 py-2.5 text-left text-sm text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
          >
            Sign out
          </ClerkSignOutButton>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto px-4 py-8 lg:px-8 lg:py-9">{children}</div>
    </div>
  );
}

function RailLink({
  item,
  active,
  badgeCount = 0,
  onNavigate,
  block,
}: {
  item: NavItem;
  active: boolean;
  badgeCount?: number;
  onNavigate?: () => void;
  block?: boolean;
}) {
  const showBadge = badgeCount > 0;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      data-active={active ? "true" : "false"}
      className={cn("desk-rail-link", block && "w-full")}
    >
      <Icon aria-hidden />
      <span>{item.label}</span>
      {showBadge && (
        <span
          className="inline-flex shrink-0 items-center border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent)]"
          aria-label={`${badgeCount} pending`}
        >
          {badgeCount > 9 ? "9+" : badgeCount}
        </span>
      )}
    </Link>
  );
}
