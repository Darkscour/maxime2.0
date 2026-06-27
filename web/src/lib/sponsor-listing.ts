/**
 * Lightweight sponsor shape for marketing demos and Supabase validation.
 * Maps both Prisma schema rows and manually imported Supabase columns.
 */

import type { Sponsor } from "@/lib/mock-data";
import { withSponsorLogo } from "@/lib/sponsor-logo";

export type SponsorListing = {
  id: string;
  name: string;
  industry: string;
  sponsorLink: string;
  difficulty: string;
  logoUrl: string | null;
  description: string | null;
  checkSize: string | null;
  regions: string[];
  games: string[];
  audience: string | null;
};

/** Shown when the database is empty or unreachable — not your live Supabase rows. */
export const DEMO_SPONSOR_LISTINGS: SponsorListing[] = [
  withSponsorLogo({
    id: "demo-1",
    name: "CORSAIR",
    industry: "Hardware / Peripherals",
    sponsorLink: "https://www.corsair.com/us/en/sponsors",
    difficulty: "Growth",
    description:
      "PC components and peripherals with a collegiate partner program — gear bundles and event support for campus orgs.",
    checkSize: "Gear + event support",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "Collegiate esports teams",
  }),
  withSponsorLogo({
    id: "demo-2",
    name: "Logitech G",
    industry: "Peripherals",
    sponsorLink: "https://www.logitechg.com/en-us/partners",
    difficulty: "Established",
    description:
      "Established mouse and keyboard brand with a dedicated team program and faster application turnaround.",
    checkSize: "Gear bundles + $5k+",
    regions: ["NA East", "NA West", "EU West"],
    games: ["VALORANT", "Counter-Strike 2", "League of Legends"],
    audience: "Competitive FPS and MOBA players",
  }),
  withSponsorLogo({
    id: "demo-3",
    name: "KontrolFreek",
    industry: "Gaming Accessories",
    sponsorLink: "https://www.kontrolfreek.com/pages/forge",
    difficulty: "Starter",
    description:
      "Controller accessories brand with a low barrier entry — ideal for newer clubs building their first sponsor deck.",
    checkSize: "Product + affiliate",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "Console and hybrid rosters",
  }),
  withSponsorLogo({
    id: "demo-4",
    name: "G FUEL",
    industry: "Energy Drinks",
    sponsorLink: "https://gfuel.com/pages/affiliate",
    difficulty: "Growth",
    description:
      "Energy drink brand active in streaming and collegiate scenes — affiliate codes and seasonal campaigns.",
    checkSize: "$2k – $10k / season",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "College Gen Z, 18–24",
  }),
  withSponsorLogo({
    id: "demo-5",
    name: "Red Bull",
    industry: "Energy Drinks",
    sponsorLink: "https://www.redbull.com/us-en/energydrink/red-bull-gaming",
    difficulty: "Established",
    description:
      "Global energy brand with a long-standing esports presence — selective collegiate and grassroots programs.",
    checkSize: "Event + media support",
    regions: ["NA East", "NA West", "EU West"],
    games: ["All"],
    audience: "Competitive and content-forward orgs",
  }),
  withSponsorLogo({
    id: "demo-6",
    name: "HyperX",
    industry: "Peripherals",
    sponsorLink: "https://hyperx.com/pages/partners",
    difficulty: "Growth",
    description:
      "Headsets, keyboards, and mice for campus and community teams — product seeding and event gear.",
    checkSize: "Gear bundles",
    regions: ["NA East", "NA West"],
    games: ["VALORANT", "Counter-Strike 2", "League of Legends"],
    audience: "Competitive rosters with stream presence",
  }),
];

export function mapPrismaSponsor(row: {
  id: string;
  name: string;
  industry: string;
  tier: string;
  applicationUrl: string;
  description?: string | null;
  checkSize?: string | null;
  regions?: string[];
  games?: string[];
  audience?: string | null;
}): SponsorListing {
  return withSponsorLogo({
    id: row.id,
    name: row.name,
    industry: row.industry,
    sponsorLink: row.applicationUrl,
    difficulty: row.tier,
    description: row.description?.trim() || null,
    checkSize: row.checkSize?.trim() || null,
    regions: row.regions ?? [],
    games: row.games ?? [],
    audience: row.audience?.trim() || null,
  });
}

/** Map a full portal sponsor into the listing shape used by AI + minimal cards. */
export function sponsorToListing(sponsor: {
  id: string;
  name: string;
  industry: string;
  applicationUrl: string;
  tier: string;
  description?: string | null;
  checkSize?: string | null;
  regions?: string[];
  games?: string[];
  audience?: string | null;
}): SponsorListing {
  return withSponsorLogo({
    id: sponsor.id,
    name: sponsor.name,
    industry: sponsor.industry,
    sponsorLink: sponsor.applicationUrl,
    difficulty: sponsor.tier,
    description: sponsor.description?.trim() || null,
    checkSize: sponsor.checkSize?.trim() || null,
    regions: sponsor.regions ?? [],
    games: sponsor.games ?? [],
    audience: sponsor.audience?.trim() || null,
  });
}

/** Rows imported via Supabase UI with spreadsheet-style column names. */
export function mapManualImportRow(row: Record<string, unknown>): SponsorListing | null {
  const id = pickString(row, ["ID", "id"]);
  const name = pickString(row, ["Name", "name"]);
  if (!id || !name) return null;

  return withSponsorLogo({
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
    description:
      pickString(row, ["description", "Description", "About"]) || null,
    checkSize:
      pickString(row, ["checkSize", "Check Size", "Typical deal", "Deal size"]) ||
      null,
    regions: pickStringArray(row, ["regions", "Regions", "Region"]),
    games: pickStringArray(row, ["games", "Games", "Titles"]),
    audience: pickString(row, ["audience", "Audience", "Target audience"]) || null,
  });
}

const KNOWN_INDUSTRIES = new Set<string>([
  "Energy Drinks",
  "Peripherals",
  "Apparel",
  "Gaming Chairs",
  "PC Hardware",
  "Fintech",
  "Food & QSR",
  "ISP / Telecom",
  "Insurance",
  "Local Business",
]);

const TIER_VALUES = new Set<string>(["Starter", "Growth", "Established"]);

/** Map a DB listing into the full portal card shape (defaults for missing columns). */
export function listingToPortalSponsor(listing: SponsorListing): Sponsor {
  const industry = KNOWN_INDUSTRIES.has(listing.industry)
    ? (listing.industry as Sponsor["industry"])
    : "Local Business";
  const tier = TIER_VALUES.has(listing.difficulty)
    ? (listing.difficulty as Sponsor["tier"])
    : "Growth";

  return {
    id: listing.id,
    name: listing.name,
    industry,
    tier,
    checkSize: listing.checkSize ?? "—",
    regions: (listing.regions.length > 0
      ? listing.regions
      : ["NA East"]) as Sponsor["regions"],
    games: (listing.games.length > 0
      ? listing.games
      : ["All"]) as Sponsor["games"],
    audience: listing.audience ?? "Collegiate esports teams",
    applicationUrl:
      listing.sponsorLink && listing.sponsorLink !== "#"
        ? listing.sponsorLink
        : "#",
    description:
      listing.description ?? `${listing.name} — imported from your sponsor database.`,
    brandHue: 195,
    active: true,
  };
}

function pickStringArray(
  row: Record<string, unknown>,
  keys: string[],
): string[] {
  for (const key of keys) {
    const v = row[key];
    if (Array.isArray(v)) {
      return v.filter((item): item is string => typeof item === "string" && !!item.trim());
    }
    if (typeof v === "string" && v.trim()) {
      return v
        .split(/[,;|]/)
        .map((part) => part.trim())
        .filter(Boolean);
    }
  }
  return [];
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
