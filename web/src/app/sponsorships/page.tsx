/**
 * Sponsorship portal page — Server Component.
 *
 * Visitors see a preview experience (demo + gated actions).
 * Signed-in users see the same shell with live Supabase rows when connected.
 */

import { DEMO_SPONSOR_LISTINGS, listingToPortalSponsor } from "@/lib/sponsor-listing";
import { fetchSponsorsForDisplay } from "@/lib/fetch-sponsors";
import { SponsorshipsPortal } from "./sponsorships-portal";

export const dynamic = "force-dynamic";

export default async function SponsorshipsPage() {
  const result = await fetchSponsorsForDisplay();
  const liveListings =
    result.source === "database" ? result.sponsors : [];
  const previewSponsors = DEMO_SPONSOR_LISTINGS.map(listingToPortalSponsor);
  const fullSponsors =
    liveListings.length > 0
      ? liveListings.map(listingToPortalSponsor)
      : previewSponsors;

  return (
    <SponsorshipsPortal
      previewSponsors={previewSponsors}
      fullSponsors={fullSponsors}
      liveCount={liveListings.length}
      dbConnected={result.source === "database"}
    />
  );
}
