import type { Region } from "@/lib/mock-data";
import { normalizeUsStateCode } from "@/lib/us-states";

/** Supported titles for onboarding and team competitive profiles. */
export const PRIMARY_GAMES = [
  "VALORANT",
  "League of Legends",
  "Rocket League",
  "Overwatch",
  "Fortnite",
] as const;

export type PrimaryGame = (typeof PRIMARY_GAMES)[number];

export const ONBOARDING_GAMES: PrimaryGame[] = [...PRIMARY_GAMES];

export const GAME_LOGO_PATHS: Record<PrimaryGame, string> = {
  VALORANT: "/games/valorant.svg",
  "League of Legends": "/games/league-of-legends.svg",
  "Rocket League": "/games/rocket-league.svg",
  Overwatch: "/games/overwatch.svg",
  Fortnite: "/games/fortnite.png",
};

export function getGameLogoPath(game: string): string | null {
  if (isPrimaryGame(game)) return GAME_LOGO_PATHS[game];
  return null;
}

export const PLAYER_ROLES = [
  { value: "In-Game Leader (IGL)", label: "🧠 In-Game Leader (IGL)" },
  { value: "Entry Fragger", label: "🎯 Entry Fragger" },
  { value: "Carry", label: "🔥 Carry" },
  { value: "Support", label: "🛡️ Support" },
  { value: "Flex", label: "🔄 Flex" },
] as const;

export type PlayerRole = (typeof PLAYER_ROLES)[number]["value"];

export function isPlayerRole(role: string): role is PlayerRole {
  return PLAYER_ROLES.some((option) => option.value === role);
}

export function formatPlayerRole(role: string): string {
  const match = PLAYER_ROLES.find((option) => option.value === role);
  return match?.label ?? role;
}

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
  Fortnite: [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Elite",
    "Champion",
    "Unreal",
  ],
};

export function getRanksForGame(game: string): string[] {
  if (!isPrimaryGame(game)) return [];
  return [...RANKS_BY_GAME[game]];
}

export function isPrimaryGame(game: string): game is PrimaryGame {
  return (PRIMARY_GAMES as readonly string[]).includes(game);
}

/** Canonical region list for all onboarding flows (player/team, collegiate/grassroots). */
export const ONBOARDING_REGIONS: Region[] = [
  "NA East",
  "NA West",
  "EU West",
  "EU Nordic",
  "LATAM",
  "APAC",
  "OCE",
];

export function isOnboardingRegion(region: string): region is Region {
  return (ONBOARDING_REGIONS as readonly string[]).includes(region);
}

/** U.S. states mapped to NA West for collegiate region auto-fill. */
const NA_WEST_STATE_CODES = new Set([
  "AK",
  "AZ",
  "CA",
  "CO",
  "HI",
  "ID",
  "MT",
  "NV",
  "NM",
  "OR",
  "UT",
  "WA",
  "WY",
]);

/** Infer NA East / NA West from a U.S. collegiate institution's state. */
export function derivePlayerRegionFromInstitutionState(
  state: string | null | undefined,
): Region | null {
  const code = normalizeUsStateCode(state);
  if (!code) return null;
  return NA_WEST_STATE_CODES.has(code) ? "NA West" : "NA East";
}

export const PLAYER_BIO_MAX_LENGTH = 150;

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
