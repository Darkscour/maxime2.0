import {
  Bookmark,
  Building2,
  Mail,
  Swords,
  Handshake,
  LayoutDashboard,
  Search,
  Settings,
  UserPlus,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badgeKey?: "joinRequests" | "teamInvites";
  isActive?: (pathname: string) => boolean;
};

export type NavGroupAccent = "cyan" | "violet" | "emerald" | "muted";

export type NavGroup = {
  label?: string;
  accent?: NavGroupAccent;
  items: NavItem[];
};

const desk: NavItem = {
  href: "/dashboard",
  label: "Desk",
  icon: LayoutDashboard,
  isActive: (pathname) => pathname === "/dashboard",
};

const account: NavItem = {
  href: "/dashboard/settings/account",
  label: "Account",
  icon: Settings,
  isActive: (pathname) =>
    pathname === "/dashboard/settings/account" ||
    pathname.startsWith("/dashboard/settings/account/"),
};

const scout: NavItem = {
  href: "/dashboard/scout",
  label: "Scout",
  icon: Search,
  isActive: (pathname) =>
    pathname === "/dashboard/scout" || pathname.startsWith("/dashboard/scout/"),
};

const joinRequests: NavItem = {
  href: "/dashboard/join-requests",
  label: "Join requests",
  icon: UserPlus,
  badgeKey: "joinRequests",
  isActive: (pathname) =>
    pathname === "/dashboard/join-requests" ||
    pathname.startsWith("/dashboard/join-requests/"),
};

const teamInvites: NavItem = {
  href: "/dashboard/invites",
  label: "Invites",
  icon: Mail,
  badgeKey: "teamInvites",
  isActive: (pathname) =>
    pathname === "/dashboard/invites" ||
    pathname.startsWith("/dashboard/invites/"),
};

const roster: NavItem = {
  href: "/dashboard/roster",
  label: "Roster",
  icon: Users,
  isActive: (pathname) =>
    pathname === "/dashboard/roster" || pathname.startsWith("/dashboard/roster/"),
};

const watchlist: NavItem = {
  href: "/dashboard/watchlist",
  label: "Watchlist",
  icon: Bookmark,
  isActive: (pathname) =>
    pathname === "/dashboard/watchlist" ||
    pathname.startsWith("/dashboard/watchlist/"),
};

const teamProfile: NavItem = {
  href: "/dashboard/settings/team",
  label: "Team",
  icon: Building2,
  isActive: (pathname) =>
    pathname === "/dashboard/settings/team" ||
    pathname.startsWith("/dashboard/settings/team/"),
};

const sponsorships: NavItem = {
  href: "/dashboard/sponsorships",
  label: "Sponsors",
  icon: Handshake,
  isActive: (pathname) =>
    pathname === "/dashboard/sponsorships" ||
    pathname.startsWith("/dashboard/sponsorships/"),
};

const duels: NavItem = {
  href: "/dashboard/duels",
  label: "Duels",
  icon: Swords,
  isActive: (pathname) =>
    pathname === "/dashboard/duels" || pathname.startsWith("/dashboard/duels/"),
};

export function getDashboardNavGroups(
  accountType: string | null,
  accountTier: string | null,
): NavGroup[] {
  if (accountType === "team_manager") {
    if (accountTier === "collegiate") {
      return [
        { items: [desk, scout, watchlist, joinRequests, roster, teamProfile, sponsorships, account] },
      ];
    }

    const items: NavItem[] =
      accountTier === "grassroots"
        ? [desk, scout, watchlist, joinRequests, roster, teamProfile, duels, account]
        : [desk, scout, watchlist, joinRequests, roster, teamProfile, account];

    return [{ items }];
  }

  return [
    {
      items: [
        desk,
        {
          href: "/dashboard/teams",
          label: "Teams",
          icon: Building2,
          isActive: (pathname) =>
            pathname === "/dashboard/teams" ||
            pathname.startsWith("/dashboard/teams/"),
        },
        teamInvites,
        {
          href: "/dashboard/settings/profile",
          label: "Profile",
          icon: UserRound,
          isActive: (pathname) =>
            pathname === "/dashboard/settings/profile" ||
            pathname.startsWith("/dashboard/settings/profile/"),
        },
        account,
      ],
    },
  ];
}

/** Flat rail items for the desk masthead navigation. */
export function getDashboardNavItems(
  accountType: string | null,
  accountTier: string | null,
): NavItem[] {
  return getDashboardNavGroups(accountType, accountTier).flatMap((g) => g.items);
}

function formatMembershipRole(role: string | null | undefined): string {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export { formatMembershipRole };

export const navGroupAccentEyebrowClasses: Record<NavGroupAccent, string> = {
  cyan: "text-[var(--accent)]",
  violet: "text-[var(--accent)]",
  emerald: "text-[var(--success)]",
  muted: "text-[var(--foreground-muted)]",
};

export const navGroupAccentBorderClasses: Record<NavGroupAccent, string> = {
  cyan: "border-[color-mix(in_srgb,var(--accent)_25%,var(--border))]",
  violet: "border-[color-mix(in_srgb,var(--accent)_25%,var(--border))]",
  emerald: "border-[color-mix(in_srgb,var(--success)_25%,var(--border))]",
  muted: "border-[var(--border)]",
};

export const navGroupAccentLinkClasses: Record<
  NavGroupAccent,
  { active: string; iconActive: string }
> = {
  cyan: {
    active:
      "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--foreground)] border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))]",
    iconActive: "text-[var(--accent)]",
  },
  violet: {
    active:
      "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--foreground)] border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))]",
    iconActive: "text-[var(--accent)]",
  },
  emerald: {
    active:
      "bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-[var(--foreground)] border border-[color-mix(in_srgb,var(--success)_35%,var(--border))]",
    iconActive: "text-[var(--success)]",
  },
  muted: {
    active:
      "bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)]",
    iconActive: "text-[var(--foreground-muted)]",
  },
};
