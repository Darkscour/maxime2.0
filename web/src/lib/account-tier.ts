export const ACCOUNT_TIERS = ["collegiate", "grassroots"] as const;

export type AccountTier = (typeof ACCOUNT_TIERS)[number];

export function isAccountTier(value: string | null | undefined): value is AccountTier {
  return value === "collegiate" || value === "grassroots";
}

export function parseAccountTier(
  searchParams: URLSearchParams | { tier?: string },
): AccountTier | null {
  const raw =
    searchParams instanceof URLSearchParams
      ? searchParams.get("tier")
      : searchParams.tier;
  return isAccountTier(raw) ? raw : null;
}

export const TIER_LABELS: Record<AccountTier, string> = {
  collegiate: "Collegiate",
  grassroots: "Grassroots",
};

export const TIER_DESCRIPTIONS: Record<
  AccountTier,
  { title: string; description: string }
> = {
  collegiate: {
    title: "Collegiate esports",
    description:
      "For university clubs and campus orgs. Recruit verified players at your school and manage your campus pipeline.",
  },
  grassroots: {
    title: "Grassroots / open team",
    description:
      "For non-collegiate teams recruiting by region. Scout players across the platform with regional filters.",
  },
};

export function getTierDescription(
  tier: AccountTier,
  role: "team_manager" | "player",
): { title: string; description: string } {
  const base = TIER_DESCRIPTIONS[tier];

  if (role === "player") {
    if (tier === "collegiate") {
      return {
        title: base.title,
        description:
          "Join your campus talent pool. Verify with a school email so teams at your university can scout you.",
      };
    }
    return {
      title: "Grassroots player",
      description:
        "Get discovered by open teams in your region. Share your rank and role — no campus affiliation needed.",
    };
  }

  if (tier === "grassroots") {
    return {
      title: "Grassroots org",
      description:
        "For semi-pro and community teams. Recruit players platform-wide with regional filters.",
    };
  }

  return base;
}
