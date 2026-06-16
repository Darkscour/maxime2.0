import { db } from "@/lib/db";

export const DUEL_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "cancelled",
  "completed",
] as const;

export type DuelStatus = (typeof DUEL_STATUSES)[number];

export function isDuelStatus(value: string): value is DuelStatus {
  return DUEL_STATUSES.includes(value as DuelStatus);
}

export async function createDuelChallenge(input: {
  challengerTeamId: string;
  targetTeamId: string;
  createdByUserId: string;
  game: string;
  message?: string | null;
  scheduledAt?: Date | null;
}) {
  if (input.challengerTeamId === input.targetTeamId) {
    throw new Error("DUEL_SELF_CHALLENGE");
  }

  const [challenger, target] = await Promise.all([
    db.team.findUnique({
      where: { id: input.challengerTeamId },
      select: { id: true, accountTier: true, name: true },
    }),
    db.team.findUnique({
      where: { id: input.targetTeamId },
      select: { id: true, accountTier: true, name: true },
    }),
  ]);
  if (!challenger || !target) throw new Error("DUEL_TEAM_NOT_FOUND");
  if (challenger.accountTier !== "grassroots" || target.accountTier !== "grassroots") {
    throw new Error("DUEL_GRASSROOTS_ONLY");
  }

  const existing = await db.duelChallenge.findFirst({
    where: {
      status: { in: ["pending", "accepted"] },
      OR: [
        {
          challengerTeamId: challenger.id,
          targetTeamId: target.id,
        },
        {
          challengerTeamId: target.id,
          targetTeamId: challenger.id,
        },
      ],
    },
    select: { id: true },
  });
  if (existing) throw new Error("DUEL_ALREADY_ACTIVE");

  return db.duelChallenge.create({
    data: {
      challengerTeamId: challenger.id,
      targetTeamId: target.id,
      createdByUserId: input.createdByUserId,
      game: input.game.trim(),
      message: input.message?.trim() || null,
      scheduledAt: input.scheduledAt ?? null,
    },
  });
}

export async function listDuelsForTeam(teamId: string) {
  return db.duelChallenge.findMany({
    where: {
      OR: [{ challengerTeamId: teamId }, { targetTeamId: teamId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      challengerTeam: { select: { id: true, name: true } },
      targetTeam: { select: { id: true, name: true } },
    },
  });
}

export async function updateDuelStatus(input: {
  duelId: string;
  teamId: string;
  status: DuelStatus;
}) {
  const duel = await db.duelChallenge.findUnique({
    where: { id: input.duelId },
  });
  if (!duel) throw new Error("DUEL_NOT_FOUND");
  if (duel.challengerTeamId !== input.teamId && duel.targetTeamId !== input.teamId) {
    throw new Error("DUEL_FORBIDDEN");
  }

  const allowed =
    input.status === "accepted" || input.status === "declined"
      ? duel.targetTeamId === input.teamId && duel.status === "pending"
      : input.status === "cancelled"
        ? duel.challengerTeamId === input.teamId && duel.status === "pending"
        : input.status === "completed"
          ? duel.status === "accepted"
          : false;
  if (!allowed) throw new Error("DUEL_INVALID_TRANSITION");

  return db.duelChallenge.update({
    where: { id: input.duelId },
    data: { status: input.status },
  });
}

