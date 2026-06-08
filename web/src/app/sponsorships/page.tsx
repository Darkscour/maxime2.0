/**
 * Public sponsorship portal — demo only. Signed-in users go to /dashboard/sponsorships.
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DEMO_SPONSOR_LISTINGS, listingToPortalSponsor } from "@/lib/sponsor-listing";
import { SponsorshipsPortal } from "./sponsorships-portal";

export const dynamic = "force-dynamic";

export default async function SponsorshipsPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard/sponsorships");
  }

  const previewSponsors = DEMO_SPONSOR_LISTINGS.map(listingToPortalSponsor);

  return <SponsorshipsPortal previewSponsors={previewSponsors} />;
}
