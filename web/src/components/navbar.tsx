"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  ClerkLoading,
} from "@clerk/nextjs";
import { ClerkUserButton } from "@/components/auth/clerk-user-button";
import { MaximeLogo } from "@/components/brand/maxime-logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useOnboardingComplete } from "@/hooks/use-onboarding-complete";
import { cn } from "@/lib/utils";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

// Chronological order matches homepage sections.
const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#features", label: "Features" },
  { href: "/#compare", label: "Why Maxime" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { showDashboard } = useOnboardingComplete();
  const resolveHref = (href: string) => {
    if (!href.includes("#")) return href;
    const hash = href.slice(href.indexOf("#"));
    return pathname === "/" ? hash : href;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--background)]/70 backdrop-blur-xl">
      <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="justify-self-start">
          <MaximeLogo size="md" priority />
        </div>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" &&
                pathname.startsWith(link.href.split("#")[0]) &&
                !link.href.includes("#"));
            return (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
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

        <div className="col-start-3 flex min-w-0 items-center justify-end gap-2 justify-self-end md:min-w-[11.5rem]">
          <div className="hidden min-h-8 min-w-[13rem] items-center justify-end gap-2 md:flex">
            <ClerkLoading>
              <span className="block h-8 w-[13rem] shrink-0" aria-hidden />
            </ClerkLoading>
            <SignedOut>
              <SignInButton
                mode="modal"
                forceRedirectUrl="/auth/continue?intent=sign-in"
                appearance={clerkAuthAppearance}
              >
                <Button variant="ghost" size="sm" className="text-white">
                  Sign in
                </Button>
              </SignInButton>
              <Button href="/sign-up" variant="primary" size="sm">
                Get started
              </Button>
            </SignedOut>
            <SignedIn>
              <div className="flex min-h-8 min-w-[13rem] items-center justify-end gap-2">
                {showDashboard ? (
                  <Link
                    href="/dashboard"
                    prefetch={false}
                    className="hidden rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white sm:inline"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <span
                    className="hidden min-w-[5.5rem] sm:inline"
                    aria-hidden
                  />
                )}
                <ClerkUserButton avatarClassName="h-8 w-8 shrink-0 ring-1 ring-cyan-400/30" />
              </div>
            </SignedIn>
          </div>

          <button
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-white/5 bg-[var(--background)] md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <SignedOut>
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/auth/continue?intent=sign-in"
                  appearance={clerkAuthAppearance}
                >
                  <Button variant="ghost" size="sm" className="flex-1 text-white">
                    Sign in
                  </Button>
                </SignInButton>
                <Button href="/sign-up" variant="primary" size="sm" className="flex-1">
                  Get started
                </Button>
              </SignedOut>
              <SignedIn>
                {showDashboard ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-md px-3 py-2 text-center text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    Dashboard
                  </Link>
                ) : null}
                <div className="flex items-center justify-end px-2">
                  <ClerkUserButton avatarClassName="h-8 w-8 ring-1 ring-cyan-400/30" />
                </div>
              </SignedIn>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
