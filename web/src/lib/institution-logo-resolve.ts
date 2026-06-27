import { institutionLogoDomains } from "@/lib/institution-domains";

const GOOGLE_PLACEHOLDER_MAX_BYTES = 800;
const FETCH_TIMEOUT_MS = 2500;

type ResolvedLogo = { body: ArrayBuffer; contentType: string };

// Process-level cache so repeated lookups (especially failures) don't re-run
// up to eight external fetches per school on every dropdown render.
const POSITIVE_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const NEGATIVE_TTL_MS = 1000 * 60 * 60; // 1h — retry missing logos later
const MAX_CACHE_ENTRIES = 500;

type CacheEntry = { value: ResolvedLogo | null; expires: number };
const logoCache = new Map<string, CacheEntry>();

function cacheGet(key: string): CacheEntry | undefined {
  const entry = logoCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expires) {
    logoCache.delete(key);
    return undefined;
  }
  return entry;
}

function cacheSet(key: string, value: ResolvedLogo | null) {
  if (logoCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = logoCache.keys().next().value;
    if (oldest !== undefined) logoCache.delete(oldest);
  }
  logoCache.set(key, {
    value,
    expires: Date.now() + (value ? POSITIVE_TTL_MS : NEGATIVE_TTL_MS),
  });
}

function logoDevUrl(domain: string): string | null {
  const token =
    process.env.LOGO_DEV_TOKEN?.trim() ??
    process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN?.trim();
  if (!token) return null;

  const params = new URLSearchParams({
    token,
    format: "png",
    theme: "dark",
    size: "128",
  });
  return `https://img.logo.dev/${encodeURIComponent(domain)}?${params.toString()}`;
}

function logoCandidateUrls(domain: string): string[] {
  const urls = [
    logoDevUrl(domain),
    `https://www.${domain}/favicon.ico`,
    `https://${domain}/favicon.ico`,
    `https://www.${domain}/apple-touch-icon.png`,
    `https://www.${domain}/apple-touch-icon-precomposed.png`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
    `https://icon.horse/icon/${domain}`,
    `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
  ];

  return urls.filter((url): url is string => !!url);
}

function isValidLogoResponse(
  url: string,
  status: number,
  contentType: string,
  byteLength: number,
): boolean {
  if (status !== 200) return false;
  if (!contentType.includes("image")) return false;
  if (byteLength < 200) return false;

  if (
    url.includes("google.com/s2/favicons") &&
    byteLength <= GOOGLE_PLACEHOLDER_MAX_BYTES
  ) {
    return false;
  }

  return true;
}

export async function resolveInstitutionLogo(
  primaryDomain: string | null | undefined,
  domains: string[] = [],
): Promise<ResolvedLogo | null> {
  const candidates = institutionLogoDomains(primaryDomain, domains);
  if (candidates.length === 0) return null;

  const cacheKey = candidates.join(",");
  const cached = cacheGet(cacheKey);
  if (cached) return cached.value;

  for (const domain of candidates) {
    for (const url of logoCandidateUrls(domain)) {
      try {
        const res = await fetch(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          headers: { Accept: "image/*,*/*" },
        });

        const contentType = res.headers.get("content-type") ?? "";
        const body = await res.arrayBuffer();

        if (!isValidLogoResponse(url, res.status, contentType, body.byteLength)) {
          continue;
        }

        const resolved: ResolvedLogo = {
          body,
          contentType: contentType.split(";")[0].trim() || "image/png",
        };
        cacheSet(cacheKey, resolved);
        return resolved;
      } catch {
        continue;
      }
    }
  }

  cacheSet(cacheKey, null);
  return null;
}
