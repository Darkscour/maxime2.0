export const COMING_SOON_PAGES: Record<
  string,
  { title: string; description: string }
> = {
  documentation: {
    title: "Documentation",
    description:
      "Step-by-step guides for managers, players, and org admins — onboarding walkthroughs, feature references, and best practices for running your program on Maxime.",
  },
  discord: {
    title: "Discord",
    description:
      "Join the Maxime community to connect with other collegiate orgs, get support, and share feedback with the team.",
  },
  changelog: {
    title: "Changelog",
    description:
      "Release notes and platform updates as we ship new features for recruitment, team ops, and sponsorships.",
  },
  roadmap: {
    title: "Roadmap",
    description:
      "See what's planned and in development across Maxime's product areas. For current capabilities, visit the Features section on our homepage.",
  },
  about: {
    title: "About",
    description:
      "Maxime is the AI operating system for collegiate and grassroots esports, built by ex team founders for the next generation of programs.",
  },
  pricing: {
    title: "Pricing",
    description:
      "Simple pricing for teams of every size. Start free and upgrade as your organization grows.",
  },
  careers: {
    title: "Careers",
    description:
      "We're building the tools collegiate esports has been missing. Check back for open roles as we scale.",
  },
  contact: {
    title: "Contact",
    description:
      "Reach the Maxime team for support, partnerships, or general inquiries.",
  },
};

export function getComingSoonPage(slug: string) {
  return COMING_SOON_PAGES[slug] ?? null;
}
