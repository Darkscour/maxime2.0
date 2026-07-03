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
  navGroupAccentBorderClasses,
  navGroupAccentEyebrowClasses,
  navGroupAccentLinkClasses,
  type NavGroupAccent,
  type NavItem,
} from "@/lib/dashboard-nav";

export function DashboardShell({
  children,
  accountType,
  accountTier,
}: {
  children: React.ReactNode;
  accountType: string | null;
  accountTier: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navGroups = getDashboardNavGroups(accountType, accountTier);
  const badges = useDashboardNavBadges();

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-1 bg-[var(--background)]">
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-[#0a0c10]/80 lg:flex lg:flex-col">
        <SidebarHeader accountType={accountType} accountTier={accountTier} />
        <SidebarNav groups={navGroups} pathname={pathname} badges={badges} />
        <SidebarFooter />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#0a0c10] transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
          <SidebarHeader accountType={accountType} accountTier={accountTier} compact />
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
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
        <header className="flex h-14 items-center gap-3 border-b border-white/5 bg-[var(--background)]/80 px-4 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <MaximeLogo size="nav" href="/dashboard" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <DashboardNotifications />
            <div className="lg:hidden">
              <ClerkUserButton avatarClassName="h-8 w-8 ring-1 ring-cyan-400/30" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">{children}</div>
      </div>
    </div>
  );
}

function SidebarHeader({
  accountType,
  accountTier,
  compact,
}: {
  accountType: string | null;
  accountTier: string | null;
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
    <div className={cn("border-b border-white/5", compact ? "" : "px-4 py-5")}>
      <Link href="/dashboard" className="inline-block">
        <MaximeLogo size="nav" href={null} />
      </Link>
      {!compact && (
        <div className="mt-4 border-t border-white/5 pt-3">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-400">
            {roleLabel}
          </span>
        </div>
      )}
    </div>
  );
}

function SidebarFooter({ onSignOut }: { onSignOut?: () => void }) {
  return (
      <div className="mt-2 space-y-2 border-t border-white/5 px-3 pb-5 pt-4">
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-inset ring-white/5">
        <ClerkUserButton avatarClassName="h-9 w-9 shrink-0 ring-1 ring-cyan-400/30" />
        <p className="min-w-0 text-xs text-zinc-500">Signed in</p>
      </div>
      <ClerkSignOutButton
        redirectUrl="/sign-in"
        onClick={onSignOut}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        <LogOut className="h-4 w-4 text-zinc-500" />
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
  return (
    <nav className="px-3 py-4">
      {groups.map((group, index) => {
        const accent = group.accent ?? "cyan";

        return (
          <div
            key={group.label ?? `nav-group-${index}`}
            className={cn(
              index > 0 && "mt-3 border-t border-dashed pt-3",
              index > 0 && navGroupAccentBorderClasses[accent],
            )}
          >
            {group.label ? (
              <p
                className={cn(
                  "mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider",
                  navGroupAccentEyebrowClasses[accent],
                )}
              >
                {group.label}
              </p>
            ) : null}
            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  accent={accent}
                  active={item.isActive?.(pathname) ?? pathname === item.href}
                  badgeCount={
                    item.badgeKey ? badges[item.badgeKey] : 0
                  }
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function SidebarLink({
  item,
  active,
  accent = "cyan",
  badgeCount = 0,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  accent?: NavGroupAccent;
  badgeCount?: number;
  onNavigate?: () => void;
}) {
  const linkStyles = navGroupAccentLinkClasses[accent];
  const Icon = item.icon;
  const showBadge = badgeCount > 0;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active
          ? linkStyles.active
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? linkStyles.iconActive : "text-zinc-500",
        )}
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {showBadge && (
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-200 ring-1 ring-inset ring-cyan-400/30"
          aria-label={`${badgeCount} pending`}
        >
          <Bell className="h-3 w-3" />
          {badgeCount > 9 ? "9+" : badgeCount}
        </span>
      )}
    </Link>
  );
}
