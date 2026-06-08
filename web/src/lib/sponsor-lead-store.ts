import { db } from "@/lib/db";
import type { SponsorLeadStatus } from "@/lib/sponsor-fit";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";

type LeadRow = {
  id: string;
  teamId: string;
  sponsorId: string;
  sponsorName: string;
  industry: string | null;
  difficulty: string | null;
  sponsorLink: string | null;
  status: string;
  fitScore: number | null;
  fitReason: string | null;
  notes: string | null;
  appliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function mapRow(row: LeadRow): SponsorLeadRecord {
  return {
    ...row,
    status: row.status as SponsorLeadStatus,
  };
}

function newId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 25);
}

/** Prefer Prisma model when generated; fall back to raw SQL (Windows dev EPERM). */
function hasPrismaSponsorLead(): boolean {
  return typeof (db as { sponsorLead?: unknown }).sponsorLead !== "undefined";
}

export async function findLeadsByTeamId(teamId: string): Promise<SponsorLeadRecord[]> {
  if (hasPrismaSponsorLead()) {
    const rows = await db.sponsorLead.findMany({
      where: { teamId },
      orderBy: { updatedAt: "desc" },
    });
    return rows as SponsorLeadRecord[];
  }

  const rows = await db.$queryRaw<LeadRow[]>`
    SELECT *
    FROM "SponsorLead"
    WHERE "teamId" = ${teamId}
    ORDER BY "updatedAt" DESC
  `;
  return rows.map(mapRow);
}

export async function upsertSponsorLead(input: {
  teamId: string;
  sponsorId: string;
  sponsorName: string;
  industry: string | null;
  difficulty: string | null;
  sponsorLink: string | null;
  fitScore: number;
  fitReason: string;
}): Promise<SponsorLeadRecord> {
  if (hasPrismaSponsorLead()) {
    const lead = await db.sponsorLead.upsert({
      where: {
        teamId_sponsorId: {
          teamId: input.teamId,
          sponsorId: input.sponsorId,
        },
      },
      create: {
        teamId: input.teamId,
        sponsorId: input.sponsorId,
        sponsorName: input.sponsorName,
        industry: input.industry,
        difficulty: input.difficulty,
        sponsorLink: input.sponsorLink,
        status: "saved",
        fitScore: input.fitScore,
        fitReason: input.fitReason,
      },
      update: {
        sponsorName: input.sponsorName,
        industry: input.industry,
        difficulty: input.difficulty,
        sponsorLink: input.sponsorLink,
        fitScore: input.fitScore,
        fitReason: input.fitReason,
      },
    });
    return lead as SponsorLeadRecord;
  }

  const existing = await db.$queryRaw<LeadRow[]>`
    SELECT *
    FROM "SponsorLead"
    WHERE "teamId" = ${input.teamId} AND "sponsorId" = ${input.sponsorId}
    LIMIT 1
  `;

  if (existing[0]) {
    const rows = await db.$queryRaw<LeadRow[]>`
      UPDATE "SponsorLead"
      SET
        "sponsorName" = ${input.sponsorName},
        "industry" = ${input.industry},
        "difficulty" = ${input.difficulty},
        "sponsorLink" = ${input.sponsorLink},
        "fitScore" = ${input.fitScore},
        "fitReason" = ${input.fitReason},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${existing[0].id}
      RETURNING *
    `;
    return mapRow(rows[0]);
  }

  const id = newId();
  const rows = await db.$queryRaw<LeadRow[]>`
    INSERT INTO "SponsorLead" (
      "id", "teamId", "sponsorId", "sponsorName", "industry", "difficulty",
      "sponsorLink", "status", "fitScore", "fitReason", "createdAt", "updatedAt"
    ) VALUES (
      ${id}, ${input.teamId}, ${input.sponsorId}, ${input.sponsorName},
      ${input.industry}, ${input.difficulty}, ${input.sponsorLink}, 'saved',
      ${input.fitScore}, ${input.fitReason}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function updateSponsorLead(input: {
  teamId: string;
  leadId?: string;
  sponsorId?: string;
  status?: SponsorLeadStatus;
  notes?: string | null;
}): Promise<SponsorLeadRecord | null> {
  if (hasPrismaSponsorLead()) {
    const existing = input.leadId
      ? await db.sponsorLead.findFirst({
          where: { id: input.leadId, teamId: input.teamId },
        })
      : input.sponsorId
        ? await db.sponsorLead.findUnique({
            where: {
              teamId_sponsorId: {
                teamId: input.teamId,
                sponsorId: input.sponsorId,
              },
            },
          })
        : null;

    if (!existing) return null;

    const nextStatus = input.status ?? existing.status;
    const lead = await db.sponsorLead.update({
      where: { id: existing.id },
      data: {
        status: nextStatus,
        notes: input.notes !== undefined ? input.notes : existing.notes,
        appliedAt:
          nextStatus === "applied" && !existing.appliedAt
            ? new Date()
            : existing.appliedAt,
      },
    });
    return lead as SponsorLeadRecord;
  }

  const existing = input.leadId
    ? await db.$queryRaw<LeadRow[]>`
        SELECT * FROM "SponsorLead"
        WHERE "id" = ${input.leadId} AND "teamId" = ${input.teamId}
        LIMIT 1
      `
    : input.sponsorId
      ? await db.$queryRaw<LeadRow[]>`
          SELECT * FROM "SponsorLead"
          WHERE "teamId" = ${input.teamId} AND "sponsorId" = ${input.sponsorId}
          LIMIT 1
        `
      : [];

  if (!existing[0]) return null;

  const row = existing[0];
  const nextStatus = input.status ?? (row.status as SponsorLeadStatus);
  const nextNotes = input.notes !== undefined ? input.notes : row.notes;
  const nextAppliedAt =
    nextStatus === "applied" && !row.appliedAt ? new Date() : row.appliedAt;

  const updated = await db.$queryRaw<LeadRow[]>`
    UPDATE "SponsorLead"
    SET
      "status" = ${nextStatus},
      "notes" = ${nextNotes},
      "appliedAt" = ${nextAppliedAt},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = ${row.id}
    RETURNING *
  `;
  return mapRow(updated[0]);
}

export async function deleteAllSponsorLeads(): Promise<number> {
  if (hasPrismaSponsorLead()) {
    const result = await db.sponsorLead.deleteMany();
    return result.count;
  }
  const result = await db.$executeRaw`DELETE FROM "SponsorLead"`;
  return Number(result);
}
