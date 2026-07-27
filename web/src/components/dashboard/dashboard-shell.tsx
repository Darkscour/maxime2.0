"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bookmark,
  Building2,
  ChevronDown,
  Handshake,
  LayoutDashboard,
  Mail,
  Menu,
  Search,
  Settings,
  Swords,
  Users,
  UserPlus,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { ClerkUserButton } from "@/components/auth/clerk-user-button";
import { ClerkSignOutButton } from "@/components/auth/clerk-sign-out-button";
import { DashboardNotifications } from "@/components/dashboard/dashboard-notifications";
import { DashboardSearch } from "@/components/dashboard/dashboard-search";
import { DashboardThemeToggle } from "@/components/dashboard/dashboard-theme-toggle";
import { useDashboardNavBadges } from "@/hooks/use-dashboard-nav-badges";
import { useDashboardTheme } from "@/hooks/use-dashboard-theme";
import { cn } from "@/lib/utils";

type BadgeKey = "joinRequests" | "teamInvites";

type SidebarLeaf = {
  kind: "leaf";
  href: string;
  label: string;
  icon: LucideIcon;
  badgeKey?: BadgeKey;
};

type SidebarGroup = {
  kind: "group";
  id: string;
  label: string;
  icon: LucideIcon;
  items: SidebarLeaf[];
};

type SidebarEntry = SidebarLeaf | SidebarGroup;

const DASHBOARD_LEAF: SidebarLeaf = {
  kind: "leaf",
  href: "/dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
};

const ACCOUNT_LEAF: SidebarLeaf = {
  kind: "leaf",
  href: "/dashboard/settings/account",
  label: "Account",
  icon: Settings,
};

function managerCommonGroups(): SidebarEntry[] {
  return [
    {
      kind: "group",
      id: "roster",
      label: "Roster",
      icon: Users,
      items: [
        { kind: "leaf", href: "/dashboard/roster", label: "Roster", icon: Users },
        {
          kind: "leaf",
          href: "/dashboard/join-requests",
          label: "Join requests",
          icon: UserPlus,
          badgeKey: "joinRequests",
        },
        { kind: "leaf", href: "/dashboard/watchlist", label: "Watchlist", icon: Bookmark },
      ],
    },
    {
      kind: "group",
      id: "recruit",
      label: "Recruit",
      icon: Search,
      items: [
        { kind: "leaf", href: "/dashboard/scout", label: "Scout", icon: Search },
        { kind: "leaf", href: "/dashboard/settings/team", label: "Team profile", icon: Building2 },
      ],
    },
  ];
}

function buildEntries(
  accountType: string | null,
  accountTier: string | null,
): SidebarEntry[] {
  if (accountType === "team_manager") {
    const opsLeaf: SidebarLeaf =
      accountTier === "grassroots"
        ? { kind: "leaf", href: "/dashboard/duels", label: "Duels", icon: Swords }
        : { kind: "leaf", href: "/dashboard/sponsorships", label: "Sponsors", icon: Handshake };
    return [DASHBOARD_LEAF, ...managerCommonGroups(), opsLeaf, ACCOUNT_LEAF];
  }

  // Player
  return [
    DASHBOARD_LEAF,
    { kind: "leaf", href: "/dashboard/teams", label: "Teams", icon: Building2 },
    {
      kind: "leaf",
      href: "/dashboard/invites",
      label: "Invites",
      icon: Mail,
      badgeKey: "teamInvites",
    },
    {
      kind: "leaf",
      href: "/dashboard/settings/profile",
      label: "Scout profile",
      icon: UserRound,
    },
    ACCOUNT_LEAF,
  ];
}

function isLeafActive(pathname: string, leaf: SidebarLeaf): boolean {
  if (leaf.href === "/dashboard") return pathname === "/dashboard";
  return pathname === leaf.href || pathname.startsWith(`${leaf.href}/`);
}

function isGroupActive(pathname: string, group: SidebarGroup): boolean {
  return group.items.some((leaf) => isLeafActive(pathname, leaf));
}

export function DashboardShell({
  children,
  accountType,
  accountTier,
  teamName,
  className,
  activeHref,
}: {
  children: React.ReactNode;
  accountType: string | null;
  accountTier: string | null;
  teamName?: string | null;
  className?: string;
  /** Force a specific href to render as active. Used by preview routes so
   *  the sidebar highlights "Dashboard" even though the URL is not
   *  `/dashboard`. */
  activeHref?: string;
}) {
  const routePathname = usePathname();
  const pathname = activeHref ?? routePathname;
  const badges = useDashboardNavBadges();
  const entries = useMemo(
    () => buildEntries(accountType, accountTier),
    [accountType, accountTier],
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle, ready } = useDashboardTheme();

  return (
    <div
      className={cn("md-desk", className)}
      data-md-theme={ready ? theme : "light"}
      suppressHydrationWarning
    >
      <div className="md-shell">
        <aside className="md-side md-side-desktop">
          <Brand />
          <SidebarBody
            entries={entries}
            pathname={pathname}
            badges={badges}
          />
        </aside>

        <div className="md-main">
          <header className="md-top">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                className="md-top-hamburger"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={16} />
              </button>
              {teamName ? (
                <div style={{ fontSize: 13, color: "var(--md-text-muted)" }}>
                  <span style={{ color: "var(--md-text-faint)" }}>Workspace · </span>
                  <span style={{ color: "var(--md-text)", fontWeight: 600 }}>{teamName}</span>
                </div>
              ) : null}
            </div>
            <div className="md-top-right">
              <DashboardSearch accountType={accountType} accountTier={accountTier} />
              <DashboardThemeToggle theme={theme} onToggle={toggle} />
              <DashboardNotifications />
              <ClerkUserButton avatarClassName="h-8 w-8" syncDashboardTheme />
            </div>
          </header>

          <main>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile off-canvas */}
      <div
        className="md-side-mobile-root"
        data-open={mobileOpen ? "true" : "false"}
        aria-hidden={!mobileOpen}
      >
        <div className="md-side-mobile-backdrop" onClick={() => setMobileOpen(false)} />
        <aside className="md-side-mobile-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Brand />
            <button
              type="button"
              className="md-top-icon-btn"
              style={{ background: "transparent", border: 0 }}
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          <SidebarBody
            entries={entries}
            pathname={pathname}
            badges={badges}
            onNavigate={() => setMobileOpen(false)}
          />
          <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--md-card-border)" }}>
            <ClerkSignOutButton
              redirectUrl="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="md-side-link"
            >
              Sign out
            </ClerkSignOutButton>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="md-side-brand">
      Maxime
    </Link>
  );
}

function SidebarBody({
  entries,
  pathname,
  badges,
  onNavigate,
}: {
  entries: SidebarEntry[];
  pathname: string;
  badges: Record<BadgeKey, number>;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Dashboard" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {entries.map((entry) =>
        entry.kind === "leaf" ? (
          <SidebarLeafLink
            key={entry.href}
            leaf={entry}
            active={isLeafActive(pathname, entry)}
            badges={badges}
            onNavigate={onNavigate}
          />
        ) : (
          <SidebarGroupBlock
            key={entry.id}
            group={entry}
            pathname={pathname}
            badges={badges}
            onNavigate={onNavigate}
          />
        ),
      )}
    </nav>
  );
}

function SidebarLeafLink({
  leaf,
  active,
  badges,
  onNavigate,
  nested = false,
}: {
  leaf: SidebarLeaf;
  active: boolean;
  badges: Record<BadgeKey, number>;
  onNavigate?: () => void;
  nested?: boolean;
}) {
  const Icon = leaf.icon;
  const badge = leaf.badgeKey ? badges[leaf.badgeKey] : 0;
  return (
    <Link
      href={leaf.href}
      onClick={onNavigate}
      data-active={active ? "true" : "false"}
      className={nested ? "md-side-group-child" : "md-side-link"}
    >
      {nested ? null : <Icon aria-hidden />}
      <span>{leaf.label}</span>
      {badge > 0 ? (
        <span className="md-side-badge" aria-label={`${badge} pending`}>
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

function SidebarGroupBlock({
  group,
  pathname,
  badges,
  onNavigate,
}: {
  group: SidebarGroup;
  pathname: string;
  badges: Record<BadgeKey, number>;
  onNavigate?: () => void;
}) {
  const activeSomewhere = isGroupActive(pathname, group);
  const [open, setOpen] = useState(activeSomewhere);
  const Icon = group.icon;
  const anyBadgeInside = group.items.reduce(
    (sum, l) => sum + (l.badgeKey ? badges[l.badgeKey] : 0),
    0,
  );

  return (
    <div>
      <button
        type="button"
        className="md-side-group-toggle"
        onClick={() => setOpen((v) => !v)}
        data-active={activeSomewhere ? "true" : "false"}
        aria-expanded={open}
      >
        <span className="md-side-group-toggle-inner">
          <Icon aria-hidden />
          <span>{group.label}</span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {anyBadgeInside > 0 && !open ? (
            <span className="md-side-badge">{anyBadgeInside > 9 ? "9+" : anyBadgeInside}</span>
          ) : null}
          <ChevronDown size={14} className="md-side-chevron" data-open={open ? "true" : "false"} />
        </span>
      </button>
      {open ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
          {group.items.map((leaf) => (
            <SidebarLeafLink
              key={leaf.href}
              leaf={leaf}
              active={isLeafActive(pathname, leaf)}
              badges={badges}
              onNavigate={onNavigate}
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
