import { db } from "@/lib/db";

export type PublicTeamListing = {
  id: string;
  name: string;
  school: string | null;
  games: string[];
  region: string | null;
  rosterSize: number | null;
  memberCount: number;
  createdAt: Date;
};

/** Teams visible to players browsing orgs on the platform. */
export async function listPublicTeams(): Promise<PublicTeamListing[]> {
  const teams = await db.team.findMany({
    where: { onboardingComplete: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      school: true,
      games: true,
      region: true,
      rosterSize: true,
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
    memberCount: team._count.members,
    createdAt: team.createdAt,
  }));
}
