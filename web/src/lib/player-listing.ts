/**
 * Demo player listings for marketing previews (homepage + /recruitment).
 * Production data will come from Postgres / external APIs.
 */

import type { Player } from "@/lib/mock-data";
import { PLAYERS } from "@/lib/mock-data";

/** Eight sample players with distinct games, roles, regions, and tags. */
export const DEMO_PLAYER_LISTINGS: Player[] = PLAYERS.slice(0, 8);

export type PlayerListing = Player;
