import { db } from "@/lib/db";
import { institutionLogoUrl } from "@/lib/logo-dev";
import { lookupInstitutionStateByDomain } from "@/lib/institution-state-lookup";
import { inferStateFromInstitutionName } from "@/lib/institution-state-infer";
import { normalizeUsStateCode } from "@/lib/us-states";

export type InstitutionListItem = {
  id: string;
  scorecardId: number;
  name: string;
  state: string | null;
  city: string | null;
  primaryDomain: string | null;
  domains: string[];
  logoUrl: string | null;
};

export type InstitutionRecord = {
  id: string;
  scorecardId: number;
  name: string;
  nameLower: string;
  state: string | null;
  city: string | null;
  primaryDomain: string | null;
  domains: string[];
  aliases: string[];
};

type InstitutionRow = {
  id: string;
  scorecardId: number;
  name: string;
  state: string | null;
  city: string | null;
  primaryDomain: string | null;
  domains: string[];
  aliases: string[];
};

function toListItem(row: {
  id: string;
  scorecardId: number;
  name: string;
  state: string | null;
  city: string | null;
  primaryDomain: string | null;
  domains?: string[];
}): InstitutionListItem {
  const domains = row.domains ?? [];
  return {
    id: row.id,
    scorecardId: row.scorecardId,
    name: row.name,
    state: row.state,
    city: row.city,
    primaryDomain: row.primaryDomain,
    domains,
    logoUrl: institutionLogoUrl(row.primaryDomain, domains),
  };
}

function mapRow(row: InstitutionRow): InstitutionRecord {
  return {
    id: row.id,
    scorecardId: row.scorecardId,
    name: row.name,
    nameLower: row.name.toLowerCase(),
    state: normalizeUsStateCode(row.state) ?? row.state,
    city: row.city,
    primaryDomain: row.primaryDomain,
    domains: row.domains ?? [],
    aliases: row.aliases ?? [],
  };
}

async function ensureInstitutionState(
  institution: InstitutionRecord,
): Promise<InstitutionRecord> {
  const existing = normalizeUsStateCode(institution.state);
  if (existing) {
    return existing === institution.state
      ? institution
      : { ...institution, state: existing };
  }

  const lookedUp =
    (await lookupInstitutionStateByDomain(
      institution.primaryDomain,
      institution.domains,
    )) ?? inferStateFromInstitutionName(institution.name);
  if (!lookedUp) return institution;

  await db.$executeRaw`
    UPDATE "Institution"
    SET state = ${lookedUp}, "updatedAt" = NOW()
    WHERE id = ${institution.id}
  `;

  return { ...institution, state: lookedUp };
}

/** Raw SQL — reliable when Prisma client is stale in dev (Institution model added after generate). */
async function queryInstitutions(
  sql: string,
  ...values: (string | number)[]
): Promise<InstitutionRow[]> {
  return db.$queryRawUnsafe<InstitutionRow[]>(sql, ...values);
}

export async function searchInstitutions(
  query: string,
  limit = 20,
): Promise<InstitutionListItem[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const pattern = `%${q}%`;

  const rows = await queryInstitutions(
    `SELECT id, "scorecardId", name, state, city, "primaryDomain", domains
     FROM "Institution"
     WHERE "nameLower" LIKE $1
     ORDER BY
       CASE WHEN "nameLower" LIKE $2 THEN 0 ELSE 1 END,
       "nameLower" ASC
     LIMIT $3`,
    pattern,
    `${q}%`,
    limit,
  );

  return rows.map(toListItem);
}

export async function getInstitutionById(id: string) {
  const rows = await queryInstitutions(
    `SELECT id, "scorecardId", name, state, city, "primaryDomain", domains, aliases
     FROM "Institution"
     WHERE id = $1
     LIMIT 1`,
    id,
  );

  const row = rows[0];
  if (!row) return null;

  const institution = await ensureInstitutionState(mapRow(row));

  return {
    ...institution,
    logoUrl: institutionLogoUrl(row.primaryDomain, row.domains ?? []),
  };
}

export async function getInstitutionCount() {
  const rows = await db.$queryRawUnsafe<[{ count: bigint }]>(
    `SELECT COUNT(*)::bigint AS count FROM "Institution"`,
  );
  return Number(rows[0]?.count ?? 0);
}

export async function hasInstitutions() {
  const rows = await db.$queryRawUnsafe<Array<{ exists: number }>>(
    `SELECT 1 AS exists FROM "Institution" LIMIT 1`,
  );
  return rows.length > 0;
}

export async function requireInstitutionRecord(id: string) {
  const rows = await queryInstitutions(
    `SELECT id, "scorecardId", name, state, city, "primaryDomain", domains, aliases
     FROM "Institution"
     WHERE id = $1
     LIMIT 1`,
    id,
  );

  const row = rows[0];
  if (!row) return null;
  return ensureInstitutionState(mapRow(row));
}
