import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MaximeLogo } from "@/components/brand/maxime-logo";

const footerNav = [
  {
    title: "Product",
    items: [
      { label: "Solutions", href: "/#solutions" },
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", href: "/coming-soon/documentation" },
      { label: "Discord", href: "/coming-soon/discord" },
      { label: "Changelog", href: "/coming-soon/changelog" },
      { label: "Roadmap", href: "/coming-soon/roadmap" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/coming-soon/about" },
      { label: "Pricing", href: "/coming-soon/pricing" },
      { label: "Careers", href: "/coming-soon/careers" },
      { label: "Contact", href: "/coming-soon/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--background-elevated)]/40">
      <Container className="grid gap-12 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <MaximeLogo size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
            The AI operating system for collegiate and grassroots esports
            organizations. Built by ex team founders for the next generation of
            teams.
          </p>
          <p className="mt-6 text-xs text-zinc-600">
            © {new Date().getFullYear()} Maxime — All rights reserved.
          </p>
        </div>

        {footerNav.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {group.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </footer>
  );
}
