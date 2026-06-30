import { normalizeUsStateCode } from "@/lib/us-states";
import { parseJsonResponse } from "@/lib/safe-json";

const HIPOLABS_URL =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

type HipolabsUniversity = {
  name: string;
  domains: string[];
  web_pages?: string[];
  alpha_two_code: string;
  "state-province"?: string | null;
};

let domainStateMapPromise: Promise<Map<string, string>> | null = null;

function domainFromUrl(url: string): string | null {
  try {
    const href = url.startsWith("http") ? url : `https://${url}`;
    const host = new URL(href).hostname.toLowerCase().replace(/^www\./, "");
    return host.includes(".") ? host : null;
  } catch {
    return null;
  }
}

async function loadDomainStateMap(): Promise<Map<string, string>> {
  if (!domainStateMapPromise) {
    domainStateMapPromise = (async () => {
      const res = await fetch(HIPOLABS_URL, { next: { revalidate: 60 * 60 * 24 } });
      if (!res.ok) {
        throw new Error(`Hipolabs fetch failed: ${res.status}`);
      }

      const data = await parseJsonResponse<HipolabsUniversity[]>(res);
      if (!data) {
        throw new Error("Hipolabs response invalid");
      }
      const map = new Map<string, string>();

      for (const uni of data) {
        if (uni.alpha_two_code !== "US") continue;
        const state = normalizeUsStateCode(uni["state-province"]);
        if (!state) continue;

        for (const domain of uni.domains) {
          map.set(domain.toLowerCase(), state);
        }
        for (const page of uni.web_pages ?? []) {
          const pageDomain = domainFromUrl(page);
          if (pageDomain) map.set(pageDomain, state);
        }
      }

      return map;
    })().catch((error) => {
      domainStateMapPromise = null;
      throw error;
    });
  }

  return domainStateMapPromise;
}

/** Resolve a missing U.S. state code from known institution email domains. */
export async function lookupInstitutionStateByDomain(
  primaryDomain: string | null | undefined,
  domains: string[] = [],
): Promise<string | null> {
  const candidates = [primaryDomain, ...domains].filter(
    (value): value is string => !!value?.trim(),
  );
  if (candidates.length === 0) return null;

  try {
    const map = await loadDomainStateMap();
    for (const domain of candidates) {
      const state = map.get(domain.trim().toLowerCase());
      if (state) return state;
    }
  } catch (error) {
    console.error("[institution-state-lookup]", error);
  }

  return null;
}
