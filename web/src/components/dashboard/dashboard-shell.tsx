"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X, Zap } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ClerkUserButton } from "@/components/auth/clerk-user-button";
import { DashboardNotifications } from "@/components/dashboard/dashboard-notifications";
import {
  getDashboardNavGroups,
  navGroupAccentBorderClasses,
  navGroupAccentEyebrowClasses,
  navGroupAccentLinkClasses,
  type NavGroupAccent,
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

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-1 bg-[var(--background)]">
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-[#0a0c10]/80 lg:flex lg:flex-col">
        <SidebarHeader accountType={accountType} accountTier={accountTier} />
        <SidebarNav groups={navGroups} pathname={pathname} />
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
          <p className="text-sm text-zinc-500 lg:hidden">Maxime</p>
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
  return (
    <div className={cn("border-b border-white/5", compact ? "" : "px-4 py-5")}>
      <Link href="/dashboard" className="group flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
          <Zap className="h-4 w-4 text-zinc-950" strokeWidth={2.5} />
        </span>
        {!compact && (
          <div>
            <p className="font-heading text-sm font-semibold text-white">Maxime</p>
            <p className="text-xs text-zinc-500">
              {accountType === "team_manager"
                ? accountTier === "grassroots"
                  ? "Grassroots manager"
                  : "Collegiate manager"
                : accountTier === "grassroots"
                  ? "Grassroots player"
                  : "Collegiate player"}
            </p>
          </div>
        )}
      </Link>
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
      <SignOutButton redirectUrl="/sign-in">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <LogOut className="h-4 w-4 text-zinc-500" />
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}

function SidebarNav({
  groups,
  pathname,
  onNavigate,
}: {
  groups: ReturnType<typeof getDashboardNavGroups>;
  pathname: string;
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
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  accent={accent}
                  active={item.isActive?.(pathname) ?? pathname === item.href}
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
  href,
  label,
  icon: Icon,
  active,
  accent = "cyan",
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  accent?: NavGroupAccent;
  onNavigate?: () => void;
}) {
  const linkStyles = navGroupAccentLinkClasses[accent];

  return (
    <Link
      href={href}
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
          "h-4 w-4",
          active ? linkStyles.iconActive : "text-zinc-500",
        )}
      />
      {label}
    </Link>
  );
}
