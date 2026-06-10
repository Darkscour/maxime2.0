import {
  Bookmark,
  Building2,
  Handshake,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
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

/** revise=1 lets completed users re-enter onboarding (layout otherwise redirects to dashboard). */
const onboarding: NavItem = {
  href: "/onboarding?revise=1",
  label: "Onboarding",
  icon: Sparkles,
  isActive: (pathname) =>
    pathname === "/onboarding" || pathname.startsWith("/onboarding/"),
};

export function getDashboardNavItems(accountType: string | null): NavItem[] {
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

  if (accountType === "team_manager") {
    return [
      overview,
      {
        href: "/dashboard/sponsorships",
        label: "Sponsorships",
        icon: Handshake,
        isActive: (pathname) =>
          pathname === "/dashboard/sponsorships" ||
          pathname.startsWith("/dashboard/sponsorships/"),
      },
      {
        href: "/dashboard/scout",
        label: "Scout players",
        icon: Search,
        isActive: (pathname) =>
          pathname === "/dashboard/scout" ||
          pathname.startsWith("/dashboard/scout/"),
      },
      {
        href: "/dashboard/roster",
        label: "Roster hub",
        icon: Users,
        isActive: (pathname) =>
          pathname === "/dashboard/roster" ||
          pathname.startsWith("/dashboard/roster/"),
      },
      {
        href: "/dashboard/watchlist",
        label: "Watchlist",
        icon: Bookmark,
        isActive: (pathname) =>
          pathname === "/dashboard/watchlist" ||
          pathname.startsWith("/dashboard/watchlist/"),
      },
      onboarding,
      account,
      {
        href: "/dashboard/settings/team",
        label: "Team profile",
        icon: Building2,
        isActive: (pathname) =>
          pathname === "/dashboard/settings/team" ||
          pathname.startsWith("/dashboard/settings/team/"),
      },
    ];
  }

  return [
    overview,
    {
      href: "/dashboard/teams",
      label: "Browse teams",
      icon: Building2,
      isActive: (pathname) =>
        pathname === "/dashboard/teams" ||
        pathname.startsWith("/dashboard/teams/"),
    },
    onboarding,
    account,
    {
      href: "/dashboard/settings/profile",
      label: "Player profile",
      icon: UserRound,
      isActive: (pathname) =>
        pathname === "/dashboard/settings/profile" ||
        pathname.startsWith("/dashboard/settings/profile/"),
    },
  ];
}

function formatMembershipRole(role: string | null | undefined): string {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export { formatMembershipRole };
