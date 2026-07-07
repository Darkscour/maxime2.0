"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, Menu, Users, X } from "lucide-react";
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

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#demo", label: "Product demo" },
  { href: "/#features", label: "Features" },
  { href: "/#compare", label: "Why Maxime" },
  { href: "/#faq", label: "FAQ" },
];
const preSolutionLinks = links.slice(0, 2);
const postSolutionLinks = links.slice(2);

const solutionLinks = [
  {
    href: "/?solution=collegiate#solutions",
    label: "Collegiate esports",
    icon: GraduationCap,
  },
  {
    href: "/?solution=grassroots#solutions",
    label: "Grassroots esports",
    icon: Users,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const { showDashboard } = useOnboardingComplete();
  const resolveHref = (href: string) => {
    if (!href.includes("#")) return href;
    const hash = href.slice(href.indexOf("#"));
    return pathname === "/" ? hash : href;
  };

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-white/5 bg-[var(--background)]/70 backdrop-blur-xl">
      <Container className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 py-2">
        <div className="shrink-0 justify-self-start overflow-visible">
          <MaximeLogo size="nav" priority />
        </div>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {preSolutionLinks.map((link) => {
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
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Solutions
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-[var(--surface)] p-1 opacity-0 shadow-2xl shadow-black/30 transition-all group-hover:visible group-hover:opacity-100">
              {solutionLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-cyan-300" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {postSolutionLinks.map((link) => {
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
            {preSolutionLinks.map((link) => (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                onClick={() => {
                  setOpen(false);
                  setMobileSolutionsOpen(false);
                }}
                className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setMobileSolutionsOpen((value) => !value)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <span>Solutions</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  mobileSolutionsOpen && "rotate-180",
                )}
              />
            </button>
            {mobileSolutionsOpen ? (
              <div className="ml-3 flex flex-col gap-1 border-l border-white/10 pl-3">
                {solutionLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setOpen(false);
                        setMobileSolutionsOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-cyan-300" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
            {postSolutionLinks.map((link) => (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                onClick={() => {
                  setOpen(false);
                  setMobileSolutionsOpen(false);
                }}
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
