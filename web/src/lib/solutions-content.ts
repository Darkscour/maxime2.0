import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bookmark,
  Building2,
  Crosshair,
  Gamepad2,
  Handshake,
  Inbox,
  Mail,
  MapPin,
  Radar,
  Search,
  Settings,
  Swords,
  Trophy,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";

export type SolutionAudience = "collegiate" | "grassroots";

export type SolutionHighlight = {
  text: string;
  icon: LucideIcon;
  tone?: "cyan" | "violet";
};

export type SolutionFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: "cyan" | "violet";
  href?: string;
  managerOnly?: boolean;
  playerOnly?: boolean;
};

export type SolutionContent = {
  audience: SolutionAudience;
  label: string;
  shortLabel: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  managerHeading: string;
  managerIntro: string;
  managerHighlights: SolutionHighlight[];
  managerFeatures: SolutionFeature[];
  playerHeading: string;
  playerIntro: string;
  playerHighlights: SolutionHighlight[];
  playerFeatures: SolutionFeature[];
  ctaTitle: string;
  ctaDescription: string;
};

export const SOLUTIONS: Record<SolutionAudience, SolutionContent> = {
  collegiate: {
    audience: "collegiate",
    label: "Collegiate esports",
    shortLabel: "Collegiate",
    heroBadge: "For campus programs",
    heroTitle: "Run your collegiate org like a",
    heroHighlight: "real esports program",
    heroDescription:
      "Maxime connects verified campus players, school-scoped recruitment, sponsor discovery, and roster management in one workspace — built for club officers and competitive collegiate teams.",
    managerHeading: "For team managers & club officers",
    managerIntro:
      "Built for school-affiliated teams with campus-bound membership.",
    managerHighlights: [
      {
        text: "Scout verified players at your school only",
        icon: Crosshair,
        tone: "violet",
      },
      {
        text: "Browse sponsors and track outreach in one directory",
        icon: Handshake,
        tone: "cyan",
      },
      {
        text: "Manage roster members, roles, and team status",
        icon: Users,
        tone: "cyan",
      },
      {
        text: "Review players who request to join your org",
        icon: UserPlus,
        tone: "cyan",
      },
      {
        text: "Save prospects and invite from your watchlist",
        icon: Bookmark,
        tone: "cyan",
      },
      {
        text: "Refine org details, titles, and sponsorship signals",
        icon: Settings,
        tone: "violet",
      },
    ],
    managerFeatures: [
      {
        title: "Campus-scoped scouting",
        description: "Browse verified players at your institution.",
        icon: Search,
        tone: "violet",
        href: "/recruitment",
      },
      {
        title: "Watchlist & invites",
        description: "Save prospects and review join requests.",
        icon: Bookmark,
        tone: "cyan",
        href: "/recruitment",
      },
      {
        title: "Sponsor directory",
        description: "Discover brands and track outreach.",
        icon: Handshake,
        tone: "cyan",
        href: "/sponsorships",
        managerOnly: true,
      },
      {
        title: "Roster hub",
        description: "Manage active players and your public team page.",
        icon: Users,
        tone: "cyan",
      },
    ],
    playerHeading: "For collegiate players",
    playerIntro:
      "Built for students who want to be visible to teams at their school.",
    playerHighlights: [
      {
        text: "Build a verified scout profile tied to your school",
        icon: BadgeCheck,
        tone: "violet",
      },
      {
        text: "Show game, rank, role, and availability on your card",
        icon: Gamepad2,
        tone: "cyan",
      },
      {
        text: "Browse teams recruiting on your campus",
        icon: Building2,
        tone: "cyan",
      },
      {
        text: "Accept or decline roster invites from one inbox",
        icon: Inbox,
        tone: "violet",
      },
    ],
    playerFeatures: [
      {
        title: "Verified player profile",
        description: "Show your game, rank, and school for campus discovery.",
        icon: UserRound,
        tone: "violet",
      },
      {
        title: "Browse campus teams",
        description: "See which orgs at your school are recruiting.",
        icon: Building2,
        tone: "cyan",
      },
      {
        title: "Team invites inbox",
        description: "Accept or decline offers in one place.",
        icon: Mail,
        tone: "violet",
      },
    ],
    ctaTitle: "Start with your campus org",
    ctaDescription:
      "Choose collegiate during onboarding to unlock school verification, campus-scoped scouting, and the sponsor directory.",
  },
  grassroots: {
    audience: "grassroots",
    label: "Grassroots esports",
    shortLabel: "Grassroots",
    heroBadge: "For community teams",
    heroTitle: "Build a grassroots org without a",
    heroHighlight: "five-person back office",
    heroDescription:
      "Maxime helps community captains recruit players by region, manage rosters, run duels, and keep team operations in one place — no campus affiliation required.",
    managerHeading: "For grassroots managers",
    managerIntro:
      "Built for community teams that recruit outside a school boundary.",
    managerHighlights: [
      {
        text: "Scout players across your region — no school required",
        icon: Radar,
        tone: "violet",
      },
      {
        text: "Send roster invites and review join requests",
        icon: UserPlus,
        tone: "cyan",
      },
      {
        text: "Manage roster members and your public team page",
        icon: Users,
        tone: "cyan",
      },
      {
        text: "Challenge other teams and track Duels activity",
        icon: Swords,
        tone: "violet",
      },
      {
        text: "Shortlist players and compare candidates on your watchlist",
        icon: Bookmark,
        tone: "cyan",
      },
      {
        text: "Refine org details and team profile settings",
        icon: Settings,
        tone: "violet",
      },
    ],
    managerFeatures: [
      {
        title: "Regional player scouting",
        description: "Browse grassroots players by game and rank.",
        icon: Search,
        tone: "violet",
        href: "/recruitment",
      },
      {
        title: "Invites & join requests",
        description: "Send roster invites and review incoming requests.",
        icon: UserPlus,
        tone: "cyan",
        href: "/recruitment",
      },
      {
        title: "Roster hub & team profile",
        description: "Manage your roster and public org details.",
        icon: Users,
        tone: "cyan",
      },
      {
        title: "Duels",
        description: "Challenge teams and track match history.",
        icon: Swords,
        tone: "violet",
      },
    ],
    playerHeading: "For grassroots players",
    playerIntro:
      "Built for players who want to join community teams beyond campus.",
    playerHighlights: [
      {
        text: "Create a discoverable profile for regional teams",
        icon: BadgeCheck,
        tone: "violet",
      },
      {
        text: "Browse grassroots orgs recruiting in your area",
        icon: MapPin,
        tone: "cyan",
      },
      {
        text: "Track recruitment invites without Discord chaos",
        icon: Inbox,
        tone: "violet",
      },
      {
        text: "Join community matchups through Duels",
        icon: Trophy,
        tone: "violet",
      },
    ],
    playerFeatures: [
      {
        title: "Discoverable profile",
        description: "Set game, role, and region so managers can find you.",
        icon: UserRound,
        tone: "violet",
      },
      {
        title: "Browse teams",
        description: "Explore grassroots orgs recruiting in your region.",
        icon: Building2,
        tone: "cyan",
      },
      {
        title: "Invite inbox",
        description: "Track team invites from your dashboard.",
        icon: Mail,
        tone: "violet",
      },
    ],
    ctaTitle: "Start with your grassroots team",
    ctaDescription:
      "Choose grassroots during onboarding if you're building outside the collegiate circuit — no school email required.",
  },
};

export function isSolutionAudience(value: string): value is SolutionAudience {
  return value === "collegiate" || value === "grassroots";
}
