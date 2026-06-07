import { db } from "@/lib/db";
import {
  mapManualImportRow,
  mapPrismaSponsor,
  type SponsorListing,
} from "@/lib/sponsor-listing";

export type SponsorFetchResult = {
  sponsors: SponsorListing[];
  /** database = live Supabase rows; empty = connected, no rows; unavailable = connection failed */
  source: "database" | "empty" | "unavailable";
  error?: string;
};

/**
 * Loads sponsors for homepage validation and demos.
 * Tries Prisma (app schema) first, then a raw query for manual Supabase imports.
 */
export async function fetchSponsorsForDisplay(): Promise<SponsorFetchResult> {
  let prismaError: string | undefined;

  try {
    const prismaRows = await db.sponsor.findMany({
      orderBy: { name: "asc" },
    });

    if (prismaRows.length > 0) {
      return {
        source: "database",
        sponsors: prismaRows.map((r) =>
          mapPrismaSponsor({
            id: r.id,
            name: r.name,
            industry: r.industry,
            tier: r.tier,
            applicationUrl: r.applicationUrl,
          }),
        ),
      };
    }
  } catch (err) {
    prismaError =
      err instanceof Error ? err.message : "Prisma query failed";
  }

  const manual = await fetchManualImportRows();
  if (manual.sponsors.length > 0) {
    return manual;
  }

  if (prismaError) {
    return {
      source: "unavailable",
      sponsors: [],
      error: prismaError,
    };
  }

  return {
    source: "empty",
    sponsors: [],
    error:
      "No sponsor rows found. Check Supabase table data and .env connection strings.",
  };
}

async function fetchManualImportRows(): Promise<SponsorFetchResult> {
  try {
    const rows = await db.$queryRaw<Record<string, unknown>[]>`
      SELECT *
      FROM "Sponsor"
      WHERE "ID" IS NOT NULL AND TRIM("ID") <> ''
      ORDER BY "Name"
    `;

    const sponsors = rows
      .map((row) => mapManualImportRow(row))
      .filter((r): r is SponsorListing => r !== null);

    if (sponsors.length === 0) return { source: "empty", sponsors: [] };

    return { source: "database", sponsors };
  } catch {
    return { source: "empty", sponsors: [] };
  }
}
