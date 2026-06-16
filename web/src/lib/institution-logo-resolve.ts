import { institutionLogoDomains } from "@/lib/institution-domains";

const GOOGLE_PLACEHOLDER_MAX_BYTES = 800;
const FETCH_TIMEOUT_MS = 8000;

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
): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const candidates = institutionLogoDomains(primaryDomain, domains);

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

        return {
          body,
          contentType: contentType.split(";")[0].trim() || "image/png",
        };
      } catch {
        continue;
      }
    }
  }

  return null;
}
