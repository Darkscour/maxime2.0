/** Extra domains for schools where Hipolabs / email domains are stale. */
const DOMAIN_ALIASES: Record<string, string[]> = {
  "liunet.edu": ["liu.edu"],
  "wheatonma.edu": ["wheatoncollege.edu"],
  "mum.edu": ["miu.edu"],
  "dwc.edu": ["snhu.edu"],
  "usl.edu": ["louisiana.edu", "ull.edu"],
  "ipfw.edu": ["pfw.edu"],
  "pvc.maricopa.edu": ["maricopa.edu"],
  "wwcc.wy.edu": ["wwcc.edu"],
  "wcslc.edu": ["westminsteru.edu"],
  "judson.edu": ["judsonu.edu"],
};

export function cleanDomain(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase().replace(/^www\./i, "");
  if (!trimmed.includes(".")) return null;
  return trimmed;
}

export function domainFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const href = url.startsWith("http") ? url : `https://${url}`;
    return cleanDomain(new URL(href).hostname);
  } catch {
    return null;
  }
}

export function mergeInstitutionDomains(
  ...groups: (string | null | undefined | string[])[]
): string[] {
  const set = new Set<string>();
  for (const g of groups) {
    if (!g) continue;
    const items = Array.isArray(g) ? g : [g];
    for (const item of items) {
      const d = cleanDomain(item);
      if (d) set.add(d);
    }
  }
  return [...set];
}

/** Order domains for logo lookup — aliases and alternates included. */
export function institutionLogoDomains(
  primaryDomain: string | null | undefined,
  domains: string[] = [],
): string[] {
  const base = mergeInstitutionDomains(primaryDomain, domains);
  const expanded: string[] = [];
  const seen = new Set<string>();

  for (const domain of base) {
    for (const candidate of [domain, ...(DOMAIN_ALIASES[domain] ?? [])]) {
      if (!seen.has(candidate)) {
        seen.add(candidate);
        expanded.push(candidate);
      }
    }
  }

  return expanded;
}
