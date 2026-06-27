import { domainFromUrl } from "@/lib/institution-domains";
import { institutionLogoUrl } from "@/lib/logo-dev";
import type { SponsorListing } from "@/lib/sponsor-listing";

/** Logo proxy URL from a sponsor application link hostname. */
export function sponsorLogoUrl(applicationUrl: string | null | undefined): string | null {
  const domain = domainFromUrl(applicationUrl);
  if (!domain) return null;
  return institutionLogoUrl(domain);
}

export function withSponsorLogo<T extends Omit<SponsorListing, "logoUrl">>(
  listing: T,
): SponsorListing {
  return {
    ...listing,
    logoUrl: sponsorLogoUrl(listing.sponsorLink),
  };
}
