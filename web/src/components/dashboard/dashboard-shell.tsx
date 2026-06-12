"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X, Zap } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ClerkUserButton } from "@/components/auth/clerk-user-button";
import { DashboardNotifications } from "@/components/dashboard/dashboard-notifications";
import { getDashboardNavItems } from "@/lib/dashboard-nav";

export function DashboardShell({
  children,
  accountType,
}: {
  children: React.ReactNode;
  accountType: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = getDashboardNavItems(accountType);

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-1 bg-[var(--background)]">
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-[#0a0c10] lg:flex lg:flex-col">
        <SidebarHeader accountType={accountType} />
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.isActive?.(pathname) ?? pathname === item.href}
            />
          ))}
        </nav>
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
          <SidebarHeader accountType={accountType} compact />
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.isActive?.(pathname) ?? pathname === item.href}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
        <SidebarFooter onSignOut={() => setMobileOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-30 flex h-14 items-center gap-3 border-b border-white/5 bg-[var(--background)] px-4 lg:px-8">
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
  compact,
}: {
  accountType: string | null;
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
              {accountType === "team_manager" ? "Team workspace" : "Player workspace"}
            </p>
          </div>
        )}
      </Link>
    </div>
  );
}

function SidebarFooter({ onSignOut }: { onSignOut?: () => void }) {
  return (
      <div className="mt-auto space-y-2 border-t border-white/5 px-3 pb-5 pt-4">
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

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-cyan-400/10 text-white ring-1 ring-inset ring-cyan-400/25"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-cyan-400" : "text-zinc-500")} />
      {label}
    </Link>
  );
}
