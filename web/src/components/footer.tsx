import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Zap } from "lucide-react";

const footerNav = [
  {
    title: "Product",
    items: [
      { label: "Recruitment", href: "/recruitment" },
      { label: "Sponsorships", href: "/sponsorships" },
      { label: "AI Coach", href: "#" },
      { label: "Roster Hub", href: "#" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", href: "#" },
      { label: "Discord", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--background-elevated)]/40">
      <Container className="grid gap-12 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
              <Zap className="h-4 w-4 text-zinc-950" strokeWidth={2.5} />
            </span>
            <span className="font-heading text-base font-semibold tracking-tight text-white">
              Maxime
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
            The AI operating system for collegiate and grassroots esports
            organizations. Built by ex‑players for the next generation of teams.
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
