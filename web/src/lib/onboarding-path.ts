import type { AccountTier } from "@/lib/account-tier";
import { isAccountTier } from "@/lib/account-tier";

/** Query param that lets signed-in users view the marketing homepage during onboarding. */
export const MARKETING_BROWSE_PARAM = "browse";

export function buildMarketingHomeHref(): string {
  return `/?${MARKETING_BROWSE_PARAM}=1`;
}

export type OnboardingQueryOptions = {
  test?: boolean;
  revise?: boolean;
  tier?: AccountTier;
  extra?: Record<string, string | undefined>;
};

/** Preserve onboarding test/revise flags across in-flow navigation. */
export function buildOnboardingHref(
  path: string,
  options?: OnboardingQueryOptions,
): string {
  const [pathname, existingQuery] = path.split("?", 2);
  const params = new URLSearchParams(existingQuery ?? "");

  if (options?.test) params.set("test", "1");
  if (options?.revise) params.set("revise", "1");
  if (options?.tier) params.set("tier", options.tier);
  if (options?.extra) {
    for (const [key, value] of Object.entries(options.extra)) {
      if (value != null) params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function onboardingQueryFromSearchParams(
  searchParams: URLSearchParams | { test?: string; revise?: string; tier?: string },
): OnboardingQueryOptions {
  const read = (key: "test" | "revise" | "tier") =>
    searchParams instanceof URLSearchParams
      ? searchParams.get(key)
      : searchParams[key];

  const tierRaw = read("tier");

  return {
    test: read("test") === "1",
    revise: read("revise") === "1",
    tier: isAccountTier(tierRaw ?? undefined)
      ? (tierRaw as AccountTier)
      : undefined,
  };
}
