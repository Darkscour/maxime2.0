import {
  Bookmark,
  Building2,
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
  isActive?: (pathname: string) => boolean;
};

export type NavGroupAccent = "cyan" | "violet" | "emerald" | "muted";

export type NavGroup = {
  label?: string;
  accent?: NavGroupAccent;
  items: NavItem[];
};

const overview: NavItem = {
  href: "/dashboard",
  label: "Overview",
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

const scoutPlayers: NavItem = {
  href: "/dashboard/scout",
  label: "Scout players",
  icon: Search,
  isActive: (pathname) =>
    pathname === "/dashboard/scout" || pathname.startsWith("/dashboard/scout/"),
};

const joinRequests: NavItem = {
  href: "/dashboard/join-requests",
  label: "Join requests",
  icon: UserPlus,
  isActive: (pathname) =>
    pathname === "/dashboard/join-requests" ||
    pathname.startsWith("/dashboard/join-requests/"),
};

const rosterHub: NavItem = {
  href: "/dashboard/roster",
  label: "Roster hub",
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
  label: "Team profile",
  icon: Building2,
  isActive: (pathname) =>
    pathname === "/dashboard/settings/team" ||
    pathname.startsWith("/dashboard/settings/team/"),
};

const sponsorships: NavItem = {
  href: "/dashboard/sponsorships",
  label: "Sponsorships",
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
        { items: [overview] },
        {
          label: "Recruitment",
          accent: "violet",
          items: [scoutPlayers, watchlist, joinRequests],
        },
        {
          label: "Team",
          accent: "cyan",
          items: [rosterHub, teamProfile],
        },
        {
          label: "Partnerships",
          accent: "emerald",
          items: [sponsorships],
        },
        {
          label: "Account",
          accent: "muted",
          items: [account],
        },
      ];
    }

    const teamItems: NavItem[] =
      accountTier === "grassroots"
        ? [rosterHub, teamProfile, duels]
        : [rosterHub, teamProfile];

    return [
      { items: [overview] },
      {
        label: "Recruitment",
        accent: "violet",
        items: [scoutPlayers, watchlist, joinRequests],
      },
      {
        label: "Team",
        accent: "cyan",
        items: teamItems,
      },
      {
        label: "Account",
        accent: "muted",
        items: [account],
      },
    ];
  }

  return [
    { items: [overview] },
    {
      label: "Explore",
      accent: "cyan",
      items: [
        {
          href: "/dashboard/teams",
          label: "Browse teams",
          icon: Building2,
          isActive: (pathname) =>
            pathname === "/dashboard/teams" ||
            pathname.startsWith("/dashboard/teams/"),
        },
      ],
    },
    {
      label: "Account",
      accent: "violet",
      items: [
        account,
        {
          href: "/dashboard/settings/profile",
          label: "Player profile",
          icon: UserRound,
          isActive: (pathname) =>
            pathname === "/dashboard/settings/profile" ||
            pathname.startsWith("/dashboard/settings/profile/"),
        },
      ],
    },
  ];
}

function formatMembershipRole(role: string | null | undefined): string {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export { formatMembershipRole };

export const navGroupAccentEyebrowClasses: Record<NavGroupAccent, string> = {
  cyan: "text-cyan-400/90",
  violet: "text-violet-400/90",
  emerald: "text-emerald-400/90",
  muted: "text-zinc-500",
};

export const navGroupAccentBorderClasses: Record<NavGroupAccent, string> = {
  cyan: "border-cyan-400/20",
  violet: "border-violet-400/20",
  emerald: "border-emerald-400/20",
  muted: "border-white/8",
};

export const navGroupAccentLinkClasses: Record<
  NavGroupAccent,
  { active: string; iconActive: string }
> = {
  cyan: {
    active: "bg-cyan-400/10 text-white ring-1 ring-inset ring-cyan-400/25",
    iconActive: "text-cyan-400",
  },
  violet: {
    active: "bg-violet-400/10 text-white ring-1 ring-inset ring-violet-400/25",
    iconActive: "text-violet-400",
  },
  emerald: {
    active: "bg-emerald-400/10 text-white ring-1 ring-inset ring-emerald-400/25",
    iconActive: "text-emerald-400",
  },
  muted: {
    active: "bg-white/[0.06] text-white ring-1 ring-inset ring-white/10",
    iconActive: "text-zinc-300",
  },
};
