/**
 * Sponsorship portal page — Server Component.
 *
 * Fetches sponsors from Postgres via Prisma, then renders the interactive
 * client portal. The portal works the same whether the data has 12 demo
 * rows or 10,000 curated brands.
 */

import { db } from "@/lib/db";
import type { Sponsor } from "@/lib/mock-data";
import { SponsorshipsPortal } from "./sponsorships-portal";

export const dynamic = "force-dynamic";

export default async function SponsorshipsPage() {
  const dbSponsors = await db.sponsor.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const sponsors: Sponsor[] = dbSponsors.map((s) => ({
    id: s.id,
    name: s.name,
    industry: s.industry as Sponsor["industry"],
    tier: s.tier as Sponsor["tier"],
    checkSize: s.checkSize,
    regions: s.regions as Sponsor["regions"],
    games: s.games as Sponsor["games"],
    audience: s.audience,
    applicationUrl: s.applicationUrl,
    contact: s.contact ?? undefined,
    description: s.description,
    brandHue: s.brandHue,
    active: s.active,
  }));

  return <SponsorshipsPortal sponsors={sponsors} />;
}
