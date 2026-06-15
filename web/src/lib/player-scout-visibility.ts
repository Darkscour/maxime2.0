/**
 * Rules for which players appear where on the manager recruitment surfaces.
 *
 * | Player state              | Scout page | Join requests | Watchlist | Roster |
 * |---------------------------|------------|---------------|-----------|--------|
 * | On your roster            | Hidden     | Hidden        | Removed   | Shown  |
 * | Requested to join you     | Shown*     | Shown         | Shown     | Hidden |
 * | Invite pending (you sent) | Shown*     | Hidden        | Shown     | Hidden |
 * | Saved on watchlist only   | Shown*     | Hidden        | Shown     | Hidden |
 * | No prior contact          | Shown*     | Hidden        | Hidden    | Hidden |
 *
 * * Scout cards show status badges (Requested to join / Invited) when applicable.
 */

export function filterPlayersForScout<T extends { id: string }>(
  players: T[],
  rosterPlayerProfileIds: Set<string>,
): T[] {
  return players.filter((player) => !rosterPlayerProfileIds.has(player.id));
}
