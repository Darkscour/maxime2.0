import { getRanksForGame } from "@/lib/onboarding-options";
import type { RosterMember } from "@/lib/team-roster";

export type PlayerRecruitmentProfile = {
  game: string;
  role: string;
  rank: string;
  region: string;
  school: string | null;
  status: string;
  tags: string[];
  hoursPerWeek: number | null;
};

export type TeamRecruitmentContext = {
  games: string[];
  region: string | null;
  school: string | null;
  rosterSize: number | null;
  activePlayerCount: number;
  /** Active roster rows with competitive fields (same game as profile when set). */
  rosterPlayers: Array<{
    game: string | null;
    role: string | null;
    rank: string | null;
    hoursPerWeek: number | null;
  }>;
};

export type PlayerRecruitmentFitBreakdown = {
  game: number;
  role: number;
  rank: number;
  availability: number;
  region: number;
  rosterNeed: number;
  school: number;
};

export type PlayerRecruitmentFitResult = {
  score: number;
  /** Short line for cards — top signals. */
  reason: string;
  reasons: string[];
  breakdown: PlayerRecruitmentFitBreakdown;
};

export function buildTeamRecruitmentContext(
  team: {
    games: string[];
    region: string | null;
    school: string | null;
    rosterSize: number | null;
  },
  roster: RosterMember[],
): TeamRecruitmentContext {
  const rosterPlayers = roster
    .filter((m) => m.role === "player")
    .map((m) => ({
      game: m.game,
      role: m.roleInGame,
      rank: m.rank,
      hoursPerWeek: m.hoursPerWeek,
    }));

  return {
    games: team.games ?? [],
    region: team.region,
    school: team.school,
    rosterSize: team.rosterSize,
    activePlayerCount: rosterPlayers.length,
    rosterPlayers,
  };
}

function normalizeRoleToken(role: string): string {
  return role.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

function rolesMatch(a: string, b: string): boolean {
  const na = normalizeRoleToken(a);
  const nb = normalizeRoleToken(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  return na.includes(nb) || nb.includes(na);
}

function normalizeSchool(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function schoolsAlign(teamSchool: string | null, playerSchool: string | null): boolean {
  const t = normalizeSchool(teamSchool);
  const p = normalizeSchool(playerSchool);
  if (!t || !p) return false;
  if (t === p) return true;
  return t.includes(p) || p.includes(t);
}

function rankIndex(game: string, rank: string): number | null {
  const ranks = getRanksForGame(game);
  const idx = ranks.indexOf(rank);
  return idx >= 0 ? idx : null;
}

function scoreGameMatch(team: TeamRecruitmentContext, player: PlayerRecruitmentProfile): number {
  if (team.games.length === 0) return 0;
  return team.games.includes(player.game) ? 100 : 0;
}

function scoreRoleNeed(
  team: TeamRecruitmentContext,
  player: PlayerRecruitmentProfile,
): { score: number; reason: string | null } {
  const onTitle = team.rosterPlayers.filter((m) => m.game === player.game);
  if (onTitle.length === 0) {
    return {
      score: team.games.includes(player.game) ? 95 : 60,
      reason: team.games.includes(player.game)
        ? `First ${player.game} player you'd add`
        : null,
    };
  }

  const sameRole = onTitle.filter((m) => m.role && rolesMatch(m.role, player.role)).length;
  if (sameRole === 0) {
    return { score: 100, reason: `${player.role} not on your ${player.game} roster` };
  }
  if (sameRole === 1) {
    return { score: 72, reason: `Depth at ${player.role}` };
  }
  if (sameRole === 2) {
    return { score: 48, reason: `You already have two ${player.role} players` };
  }
  return { score: 28, reason: `${player.role} slot likely covered` };
}

function scoreRankBand(
  team: TeamRecruitmentContext,
  player: PlayerRecruitmentProfile,
): { score: number; reason: string | null } {
  const playerIdx = rankIndex(player.game, player.rank);
  if (playerIdx === null) {
    return { score: 62, reason: null };
  }

  const peerRanks = team.rosterPlayers
    .filter((m) => m.game === player.game && m.rank)
    .map((m) => rankIndex(player.game, m.rank!))
    .filter((i): i is number => i !== null);

  if (peerRanks.length === 0) {
    return { score: 88, reason: `${player.rank} sets the bar for ${player.game}` };
  }

  const avg = peerRanks.reduce((a, b) => a + b, 0) / peerRanks.length;
  const diff = Math.abs(playerIdx - avg);
  if (diff <= 0.5) {
    return { score: 100, reason: `${player.rank} matches your roster level` };
  }
  if (diff <= 1.5) {
    return { score: 84, reason: `${player.rank} close to roster rank band` };
  }
  if (diff <= 2.5) {
    return { score: 62, reason: `${player.rank} a step from roster average` };
  }
  return { score: 38, reason: `${player.rank} far from roster average` };
}

function scoreAvailability(player: PlayerRecruitmentProfile): {
  score: number;
  reason: string | null;
} {
  const status = player.status.trim().toLowerCase();
  let statusScore = 70;
  let statusReason: string | null = null;

  if (status === "available") {
    statusScore = 100;
    statusReason = "Available now";
  } else if (status === "open to offers") {
    statusScore = 88;
    statusReason = "Open to offers";
  } else if (status === "contracted") {
    statusScore = 30;
    statusReason = "Listed as contracted";
  }

  const hours = player.hoursPerWeek;
  let hoursScore = 68;
  if (hours == null) {
    hoursScore = 68;
  } else if (hours >= 20) {
    hoursScore = 100;
    statusReason = statusReason ?? `${hours} hrs/week commitment`;
  } else if (hours >= 12) {
    hoursScore = 86;
    statusReason = statusReason ?? `${hours} hrs/week`;
  } else if (hours >= 6) {
    hoursScore = 68;
  } else {
    hoursScore = 42;
    statusReason = "Low weekly hours listed";
  }

  const score = Math.round(statusScore * 0.55 + hoursScore * 0.45);
  return { score, reason: statusReason };
}

function scoreRegion(
  team: TeamRecruitmentContext,
  player: PlayerRecruitmentProfile,
): { score: number; reason: string | null } {
  if (!team.region?.trim()) return { score: 72, reason: null };
  if (team.region === player.region) {
    return { score: 100, reason: `Same region (${player.region})` };
  }

  const naEast = new Set(["NA East"]);
  const naWest = new Set(["NA West"]);
  const eu = new Set(["EU West", "EU Nordic"]);
  const playerR = player.region;
  const teamR = team.region;

  const sameBucket =
    (naEast.has(teamR) && naEast.has(playerR)) ||
    (naWest.has(teamR) && naWest.has(playerR)) ||
    (eu.has(teamR) && eu.has(playerR));

  if (sameBucket) {
    return { score: 78, reason: "Nearby region bucket" };
  }
  return { score: 42, reason: "Different region" };
}

function scoreSchool(
  team: TeamRecruitmentContext,
  player: PlayerRecruitmentProfile,
): { score: number; reason: string | null } {
  if (!team.school?.trim()) return { score: 70, reason: null };
  if (schoolsAlign(team.school, player.school)) {
    return { score: 100, reason: "Same school / campus" };
  }
  if (player.school?.trim()) {
    return { score: 45, reason: "Different school" };
  }
  return { score: 58, reason: null };
}

function scoreRosterNeed(team: TeamRecruitmentContext): {
  score: number;
  reason: string | null;
} {
  const target = team.rosterSize;
  if (target == null || target <= 0) {
    return { score: 75, reason: null };
  }
  const open = Math.max(0, target - team.activePlayerCount);
  if (open >= 3) {
    return { score: 100, reason: `${open} open roster slots` };
  }
  if (open >= 1) {
    return { score: 90, reason: open === 1 ? "1 open roster slot" : `${open} open slots` };
  }
  return { score: 35, reason: "Roster at target size" };
}

type WeightedPart = { key: keyof PlayerRecruitmentFitBreakdown; weight: number; reason: string | null };

/** Rule-based fit for managers scouting players into their org. */
export function scorePlayerRecruitmentFit(
  team: TeamRecruitmentContext,
  player: PlayerRecruitmentProfile,
): PlayerRecruitmentFitResult {
  if (team.games.length === 0) {
    return {
      score: 0,
      reason: "Add competitive titles on your team profile to score fit",
      reasons: ["Add competitive titles on your team profile to score fit"],
      breakdown: {
        game: 0,
        role: 0,
        rank: 0,
        availability: 0,
        region: 0,
        rosterNeed: 0,
        school: 0,
      },
    };
  }

  const game = scoreGameMatch(team, player);
  if (game === 0) {
    return {
      score: 0,
      reason: `Plays ${player.game} — not on your org titles`,
      reasons: [`Plays ${player.game} — not on your org titles`],
      breakdown: {
        game: 0,
        role: 0,
        rank: 0,
        availability: 0,
        region: 0,
        rosterNeed: 0,
        school: 0,
      },
    };
  }

  const role = scoreRoleNeed(team, player);
  const rank = scoreRankBand(team, player);
  const availability = scoreAvailability(player);
  const region = scoreRegion(team, player);
  const school = scoreSchool(team, player);
  const rosterNeed = scoreRosterNeed(team);

  const breakdown: PlayerRecruitmentFitBreakdown = {
    game: 100,
    role: role.score,
    rank: rank.score,
    availability: availability.score,
    region: region.score,
    rosterNeed: rosterNeed.score,
    school: school.score,
  };

  const collegiateSchool = Boolean(team.school?.trim());
  const parts: WeightedPart[] = collegiateSchool
    ? [
        { key: "role", weight: 0.26, reason: role.reason },
        { key: "rank", weight: 0.22, reason: rank.reason },
        { key: "availability", weight: 0.2, reason: availability.reason },
        { key: "region", weight: 0.1, reason: region.reason },
        { key: "rosterNeed", weight: 0.12, reason: rosterNeed.reason },
        { key: "school", weight: 0.1, reason: school.reason },
      ]
    : [
        { key: "role", weight: 0.28, reason: role.reason },
        { key: "rank", weight: 0.24, reason: rank.reason },
        { key: "availability", weight: 0.22, reason: availability.reason },
        { key: "region", weight: 0.14, reason: region.reason },
        { key: "rosterNeed", weight: 0.12, reason: rosterNeed.reason },
        { key: "school", weight: 0, reason: null },
      ];

  let weighted = 0;
  let weightSum = 0;
  for (const part of parts) {
    if (part.weight <= 0) continue;
    weighted += breakdown[part.key] * part.weight;
    weightSum += part.weight;
  }

  let score = Math.round(weighted / weightSum);
  if (player.hoursPerWeek == null && !player.status.trim()) {
    score = Math.max(0, score - 4);
  }
  score = Math.min(100, Math.max(0, score));

  const reasonEntries = parts
    .filter((p) => p.reason)
    .map((p) => ({ reason: p.reason!, contribution: breakdown[p.key] * p.weight }))
    .sort((a, b) => b.contribution - a.contribution);

  const reasons = reasonEntries.map((r) => r.reason).slice(0, 4);
  const reason = reasons.slice(0, 2).join(" · ") || "General roster match";

  return { score, reason, reasons, breakdown };
}

export function rankPlayersByRecruitmentFit<
  T extends PlayerRecruitmentProfile & { id: string; handle: string },
>(
  team: TeamRecruitmentContext,
  players: T[],
): Array<T & PlayerRecruitmentFitResult> {
  return players
    .map((player) => ({
      ...player,
      ...scorePlayerRecruitmentFit(team, player),
    }))
    .sort((a, b) => b.score - a.score || a.handle.localeCompare(b.handle));
}
