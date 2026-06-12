import type { Region } from "@/lib/mock-data";

/** Supported titles for onboarding and team competitive profiles. */
export const PRIMARY_GAMES = [
  "VALORANT",
  "League of Legends",
  "Rocket League",
  "Overwatch",
] as const;

export type PrimaryGame = (typeof PRIMARY_GAMES)[number];

export const ONBOARDING_GAMES: PrimaryGame[] = [...PRIMARY_GAMES];

export const RANKS_BY_GAME: Record<PrimaryGame, readonly string[]> = {
  VALORANT: [
    "Iron",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Ascendant",
    "Immortal",
    "Radiant",
  ],
  "League of Legends": [
    "Iron",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Emerald",
    "Diamond",
    "Master",
    "Grandmaster",
    "Challenger",
  ],
  "Rocket League": [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Champion",
    "Grand Champion",
    "Supersonic Legend",
  ],
  Overwatch: [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Top 500",
  ],
};

export function getRanksForGame(game: string): string[] {
  if (game in RANKS_BY_GAME) {
    return [...RANKS_BY_GAME[game as PrimaryGame]];
  }
  return [];
}

export function isPrimaryGame(game: string): game is PrimaryGame {
  return (PRIMARY_GAMES as readonly string[]).includes(game);
}

export const ONBOARDING_REGIONS: Region[] = [
  "NA East",
  "NA West",
  "EU West",
  "EU Nordic",
  "LATAM",
  "APAC",
];

/** Player onboarding — limited region list for now. */
export const PLAYER_ONBOARDING_REGIONS: Region[] = ["NA East", "NA West"];

export const PLAYER_BIO_MAX_LENGTH = 100;

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
