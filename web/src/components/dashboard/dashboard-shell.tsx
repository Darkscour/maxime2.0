"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClerkUserButton } from "@/components/auth/clerk-user-button";
import { ClerkSignOutButton } from "@/components/auth/clerk-sign-out-button";
import { MaximeLogo } from "@/components/brand/maxime-logo";
import { DashboardNotifications } from "@/components/dashboard/dashboard-notifications";
import { useDashboardNavBadges } from "@/hooks/use-dashboard-nav-badges";
import {
  getDashboardNavGroups,
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
  const navGroups = getDashboardNavGroups(accountType, accountTier);
  const badges = useDashboardNavBadges();

  return (
    <div className={cn("dashboard-program flex min-h-[calc(100vh-0px)] flex-1", className)}>
      <aside className="hidden w-[16rem] shrink-0 border-r-2 border-[var(--foreground)] bg-[var(--surface)] lg:flex lg:flex-col">
        <SidebarHeader
          accountType={accountType}
          accountTier={accountTier}
          teamName={teamName}
        />
        <SidebarNav groups={navGroups} pathname={pathname} badges={badges} />
        <SidebarFooter />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(15,28,46,0.45)] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[16rem] flex-col border-r-2 border-[var(--foreground)] bg-[var(--surface)] transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b-2 border-[var(--foreground)] px-4 py-4">
          <SidebarHeader
            accountType={accountType}
            accountTier={accountTier}
            teamName={teamName}
            compact
          />
          <button
            type="button"
            aria-label="Close menu"
            className="p-2 text-[var(--foreground-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav
          groups={navGroups}
          pathname={pathname}
          badges={badges}
          onNavigate={() => setMobileOpen(false)}
        />
        <SidebarFooter onSignOut={() => setMobileOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-3 border-b-2 border-[var(--foreground)] bg-[var(--surface)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="Open menu"
            className="p-2 text-[var(--foreground-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)] lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <MaximeLogo size="nav" href="/dashboard" />
          </div>
          <div className="hidden min-w-0 items-baseline gap-3 lg:flex">
            <p className="pb-kicker">Program board</p>
            {teamName ? (
              <>
                <span className="text-[var(--border-strong)]" aria-hidden>
                  /
                </span>
                <p className="font-board truncate text-sm font-semibold uppercase tracking-[0.06em] text-[var(--foreground)]">
                  {teamName}
                </p>
              </>
            ) : null}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <DashboardNotifications />
            <div className="lg:hidden">
              <ClerkUserButton avatarClassName="h-8 w-8 ring-1 ring-[var(--border)]" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-7 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}

function SidebarHeader({
  accountType,
  accountTier,
  teamName,
  compact,
}: {
  accountType: string | null;
  accountTier: string | null;
  teamName?: string | null;
  compact?: boolean;
}) {
  const roleLabel =
    accountType === "team_manager"
      ? accountTier === "grassroots"
        ? "Grassroots manager"
        : "Collegiate manager"
      : accountTier === "grassroots"
        ? "Grassroots player"
        : "Collegiate player";

  return (
    <div className={cn("border-b-2 border-[var(--foreground)]", compact ? "" : "px-4 py-5")}>
      <Link href="/dashboard" className="inline-block">
        <MaximeLogo size="nav" href={null} />
      </Link>
      {!compact && (
        <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-3">
          <p className="inline-block border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            {roleLabel}
          </p>
          {teamName ? (
            <p className="font-board text-sm font-semibold uppercase tracking-[0.04em] text-[var(--foreground)]">
              {teamName}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SidebarFooter({ onSignOut }: { onSignOut?: () => void }) {
  return (
    <div className="mt-auto space-y-2 border-t-2 border-[var(--foreground)] px-3 pb-5 pt-4">
      <div className="flex items-center gap-3 bg-[var(--background)] px-3 py-2.5">
        <ClerkUserButton avatarClassName="h-9 w-9 shrink-0 ring-1 ring-[var(--border)]" />
        <p className="min-w-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
          Signed in
        </p>
      </div>
      <ClerkSignOutButton
        redirectUrl="/sign-in"
        onClick={onSignOut}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
      >
        <LogOut className="h-4 w-4 text-[var(--foreground-muted)]" />
        Sign out
      </ClerkSignOutButton>
    </div>
  );
}

function SidebarNav({
  groups,
  pathname,
  badges,
  onNavigate,
}: {
  groups: ReturnType<typeof getDashboardNavGroups>;
  pathname: string;
  badges: ReturnType<typeof useDashboardNavBadges>;
  onNavigate?: () => void;
}) {
  let linkIndex = 0;

  return (
    <nav className="flex-1 overflow-y-auto px-2 py-4">
      {groups.map((group, index) => (
        <div
          key={group.label ?? `nav-group-${index}`}
          className={cn(index > 0 && "mt-5 border-t border-[var(--border)] pt-4")}
        >
          {group.label ? (
            <p className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">
              {group.label}
            </p>
          ) : null}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              linkIndex += 1;
              return (
                <SidebarLink
                  key={item.href}
                  item={item}
                  index={linkIndex}
                  active={item.isActive?.(pathname) ?? pathname === item.href}
                  badgeCount={item.badgeKey ? badges[item.badgeKey] : 0}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarLink({
  item,
  index,
  active,
  badgeCount = 0,
  onNavigate,
}: {
  item: NavItem;
  index: number;
  active: boolean;
  badgeCount?: number;
  onNavigate?: () => void;
}) {
  const showBadge = badgeCount > 0;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      data-active={active ? "true" : "false"}
      className="pb-sidebar-link"
    >
      <span className="font-mono text-[10px] tracking-[0.08em] text-[var(--foreground-subtle)]">
        {String(index).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {showBadge && (
        <span
          className="inline-flex shrink-0 items-center gap-1 border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent)]"
          aria-label={`${badgeCount} pending`}
        >
          <Bell className="h-3 w-3" />
          {badgeCount > 9 ? "9+" : badgeCount}
        </span>
      )}
    </Link>
  );
}
