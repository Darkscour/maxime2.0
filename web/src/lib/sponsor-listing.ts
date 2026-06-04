/**
 * Lightweight sponsor shape for marketing demos and Supabase validation.
 * Maps both Prisma schema rows and manually imported Supabase columns.
 */

export type SponsorListing = {
  id: string;
  name: string;
  industry: string;
  sponsorLink: string;
  difficulty: string;
};

/** Shown when the database is empty or unreachable — not your live Supabase rows. */
export const DEMO_SPONSOR_LISTINGS: SponsorListing[] = [
  {
    id: "demo-1",
    name: "CORSAIR",
    industry: "Hardware / Peripherals",
    sponsorLink: "https://www.corsair.com/us/en/sponsors",
    difficulty: "Growth",
  },
  {
    id: "demo-2",
    name: "Logitech G",
    industry: "Peripherals",
    sponsorLink: "https://www.logitechg.com/en-us/partners",
    difficulty: "Established",
  },
  {
    id: "demo-3",
    name: "KontrolFreek",
    industry: "Gaming Accessories",
    sponsorLink: "https://www.kontrolfreek.com/pages/forge",
    difficulty: "Starter",
  },
  {
    id: "demo-4",
    name: "G FUEL",
    industry: "Energy Drinks",
    sponsorLink: "https://gfuel.com/pages/affiliate",
    difficulty: "Growth",
  },
];

export function mapPrismaSponsor(row: {
  id: string;
  name: string;
  industry: string;
  tier: string;
  applicationUrl: string;
}): SponsorListing {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    sponsorLink: row.applicationUrl,
    difficulty: row.tier,
  };
}

/** Rows imported via Supabase UI with spreadsheet-style column names. */
export function mapManualImportRow(row: Record<string, unknown>): SponsorListing | null {
  const id = pickString(row, ["ID", "id"]);
  const name = pickString(row, ["Name", "name"]);
  if (!id || !name) return null;

  return {
    id,
    name,
    industry: pickString(row, ["Industry", "industry"]) || "—",
    sponsorLink:
      pickString(row, ["sponsor_link", "applicationUrl", "Sponsorship Link"]) ||
      "#",
    difficulty:
      pickString(row, [
        "Sponsorship Difficulty",
        "tier",
        "Tier",
        "difficulty",
      ]) || "—",
  };
}

function pickString(
  row: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}
