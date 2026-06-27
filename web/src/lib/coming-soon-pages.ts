export const COMING_SOON_PAGES: Record<
  string,
  { title: string; description: string }
> = {
  documentation: {
    title: "Documentation",
    description:
      "Guides for managers, players, and org admins are on the way. Check back soon for onboarding walkthroughs and feature docs.",
  },
  discord: {
    title: "Discord",
    description:
      "Our community Discord is launching soon. You'll be able to connect with other orgs, get support, and share feedback there.",
  },
  changelog: {
    title: "Changelog",
    description:
      "A public record of platform updates is coming soon. We'll publish release notes here as new features ship.",
  },
  roadmap: {
    title: "Roadmap",
    description:
      "A dedicated roadmap page is on the way. For now, see what's in development on the homepage Features section.",
  },
  about: {
    title: "About",
    description:
      "Our story, mission, and team page are still being built. More about Maxime and the founders is coming soon.",
  },
  pricing: {
    title: "Pricing",
    description:
      "Pricing tiers and plan details are coming soon. Sign up today to get started while we finalize our plans.",
  },
  careers: {
    title: "Careers",
    description:
      "Open roles and hiring information will be posted here soon. We're not actively hiring yet, but check back.",
  },
  contact: {
    title: "Contact",
    description:
      "A contact form and support channels are on the way. We'll share the best way to reach the Maxime team here soon.",
  },
};

export function getComingSoonPage(slug: string) {
  return COMING_SOON_PAGES[slug] ?? null;
}
