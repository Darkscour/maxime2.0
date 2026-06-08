import {
  Building2,
  Handshake,
  LayoutDashboard,
  Settings,
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
      account,
      {
        href: "/dashboard/settings/team",
        label: "Team profile",
        icon: Building2,
        isActive: (pathname) =>
          pathname === "/dashboard/settings/team" ||
          pathname.startsWith("/dashboard/settings/team/"),
      },
      {
        href: "/recruitment",
        label: "Recruitment",
        icon: Users,
        isActive: (pathname) =>
          pathname === "/recruitment" || pathname.startsWith("/recruitment/"),
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
