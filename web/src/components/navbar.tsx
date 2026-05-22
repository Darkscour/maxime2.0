"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/recruitment", label: "Recruitment" },
  { href: "/sponsorships", label: "Sponsorships" },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--background)]/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
            <Zap className="h-4 w-4 text-zinc-950" strokeWidth={2.5} />
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            Clutch
            <span className="text-cyan-400">.gg</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && !link.href.includes("#"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button href="#" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button href="#" variant="primary" size="sm">
            Get started
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-white/5 bg-[var(--background)] md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button href="#" variant="ghost" size="sm" className="flex-1">
                Sign in
              </Button>
              <Button href="#" variant="primary" size="sm" className="flex-1">
                Get started
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
