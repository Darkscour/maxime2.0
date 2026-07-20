import Link from "next/link";

import { Container } from "@/components/ui/container";
import { MaximeLogo } from "@/components/brand/maxime-logo";

type FooterProps = {
  /** When set, product hash links stay on that route instead of `/`. */
  hashRoot?: string;
  logoHref?: string;
};

function productHref(hashRoot: string, hash: string) {
  return hashRoot === "/" ? `/${hash}` : `${hashRoot}${hash}`;
}

export function Footer({ hashRoot = "/", logoHref = "/" }: FooterProps = {}) {
  const footerNav = [
    {
      title: "Product",
      items: [
        { label: "Solutions", href: productHref(hashRoot, "#solutions") },
        { label: "Features", href: productHref(hashRoot, "#features") },
        { label: "How it works", href: productHref(hashRoot, "#how-it-works") },
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

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container className="grid gap-12 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <MaximeLogo size="lg" href={logoHref} />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--foreground-muted)]">
            The AI operating system for collegiate and grassroots esports
            organizations. Built by ex team founders for the next generation of
            teams.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">
            © {new Date().getFullYear()} Maxime — All rights reserved.
          </p>
        </div>

        {footerNav.map((group) => (
          <div key={group.title}>
            <h4 className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
              {group.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
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
