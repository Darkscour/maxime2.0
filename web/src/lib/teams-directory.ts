import { db } from "@/lib/db";
import { parseTier } from "@/lib/audience-guards";
import {
  buildTeamRecruitmentContext,
  type TeamRecruitmentContext,
} from "@/lib/player-recruitment-fit";
import type { RosterMember } from "@/lib/team-roster";

export type PublicTeamListing = {
  id: string;
  name: string;
  school: string | null;
  games: string[];
  region: string | null;
  rosterSize: number | null;
  discordUrl: string | null;
  accountTier: string | null;
  memberCount: number;
  createdAt: Date;
};

export type PublicTeamListingWithFit = PublicTeamListing & {
  recruitmentContext: TeamRecruitmentContext;
};

/** Teams visible to players browsing orgs on the platform. */
export async function listPublicTeams(playerTier?: string | null): Promise<PublicTeamListing[]> {
  const tier = parseTier(playerTier);
  if (!tier) return [];
  const teams = await db.team.findMany({
    where: { onboardingComplete: true, accountTier: tier },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      school: true,
      games: true,
      region: true,
      rosterSize: true,
      discordUrl: true,
      accountTier: true,
      createdAt: true,
      _count: { select: { members: { where: { status: "active" } } } },
    },
  });

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    school: team.school,
    games: team.games,
    region: team.region,
    rosterSize: team.rosterSize,
    discordUrl: team.discordUrl,
    accountTier: team.accountTier,
    memberCount: team._count.members,
    createdAt: team.createdAt,
  }));
}

/** Public teams plus roster competitive fields for player↔org fit scoring. */
export async function listPublicTeamsWithFitContext(
  playerTier?: string | null,
): Promise<PublicTeamListingWithFit[]> {
  const tier = parseTier(playerTier);
  if (!tier) return [];

  const teams = await db.team.findMany({
    where: { onboardingComplete: true, accountTier: tier },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      school: true,
      games: true,
      region: true,
      rosterSize: true,
      discordUrl: true,
      accountTier: true,
      createdAt: true,
      members: {
        where: { status: "active" },
        select: {
          role: true,
          user: {
            select: {
              playerProfile: {
                select: {
                  game: true,
                  role: true,
                  rank: true,
                  hoursPerWeek: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return teams.map((team) => {
    const roster: RosterMember[] = team.members.map((member, index) => ({
      membershipId: `${team.id}-${index}`,
      userId: `${team.id}-user-${index}`,
      role: member.role,
      joinedAt: team.createdAt,
      email: null,
      displayName: null,
      handle: null,
      game: member.user.playerProfile?.game ?? null,
      roleInGame: member.user.playerProfile?.role ?? null,
      rank: member.user.playerProfile?.rank ?? null,
      school: null,
      hoursPerWeek: member.user.playerProfile?.hoursPerWeek ?? null,
      playerProfileId: null,
      clerkId: "",
    }));

    return {
      id: team.id,
      name: team.name,
      school: team.school,
      games: team.games,
      region: team.region,
      rosterSize: team.rosterSize,
      discordUrl: team.discordUrl,
      accountTier: team.accountTier,
      memberCount: team.members.length,
      createdAt: team.createdAt,
      recruitmentContext: buildTeamRecruitmentContext(
        {
          games: team.games ?? [],
          region: team.region,
          school: team.school,
          rosterSize: team.rosterSize,
        },
        roster,
      ),
    };
  });
}
