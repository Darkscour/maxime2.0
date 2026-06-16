import { institutionLogoDomains } from "@/lib/institution-domains";

/**
 * Logo URL for the school picker — resolved server-side via multi-source fallback.
 */
export function institutionLogoUrl(
  primaryDomain: string | null | undefined,
  domains: string[] = [],
): string | null {
  const candidates = institutionLogoDomains(primaryDomain, domains);
  if (candidates.length === 0) return null;

  return `/api/institutions/logo?d=${encodeURIComponent(candidates.join(","))}`;
}

export function institutionInitials(name: string): string {
  const words = name
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(of|the|and|at)$/i.test(w));

  if (words.length === 0) {
    return name.slice(0, 2).toUpperCase();
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
}
