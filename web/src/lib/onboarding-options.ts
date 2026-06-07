import type { Game, Rank, Region } from "@/lib/mock-data";

export const ONBOARDING_GAMES: Game[] = [
  "League of Legends",
  "VALORANT",
  "Counter-Strike 2",
  "Rocket League",
  "Overwatch 2",
  "Apex Legends",
  "Dota 2",
];

export const ONBOARDING_REGIONS: Region[] = [
  "NA East",
  "NA West",
  "EU West",
  "EU Nordic",
  "LATAM",
  "APAC",
];

export const ONBOARDING_RANKS: Rank[] = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Ascendant",
  "Immortal",
  "Master",
  "Grandmaster",
  "Challenger",
  "Radiant",
];

export const PLAYER_STATUSES = [
  "Available",
  "Open to offers",
  "Contracted",
] as const;

export function slugifyTeamName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
