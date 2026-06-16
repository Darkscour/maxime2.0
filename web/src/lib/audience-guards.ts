type Tier = "collegiate" | "grassroots";

export type TeamAudienceContext = {
  accountTier: string | null | undefined;
  institutionId?: string | null | undefined;
};

export type PlayerAudienceContext = {
  accountTier: string | null | undefined;
  institutionId: string | null | undefined;
};

export function parseTier(input: string | null | undefined): Tier | null {
  if (input === "collegiate" || input === "grassroots") return input;
  return null;
}

export function canManagerRecruitPlayer(
  managerTeam: TeamAudienceContext,
  player: PlayerAudienceContext,
): boolean {
  const teamTier = parseTier(managerTeam.accountTier);
  const playerTier = parseTier(player.accountTier);
  if (!teamTier || !playerTier) return false;

  if (teamTier === "grassroots") {
    return playerTier === "grassroots";
  }

  if (playerTier !== "collegiate") return false;
  return !!managerTeam.institutionId && managerTeam.institutionId === player.institutionId;
}

export function canPlayerJoinTeam(
  player: PlayerAudienceContext,
  team: TeamAudienceContext,
): boolean {
  const playerTier = parseTier(player.accountTier);
  const teamTier = parseTier(team.accountTier);
  if (!playerTier || !teamTier) return false;
  return playerTier === teamTier;
}

