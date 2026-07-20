"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, Menu, Users, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  ClerkLoading,
} from "@clerk/nextjs";
import { ClerkUserButton } from "@/components/auth/clerk-user-button";
import { MaximeHomeLogo } from "@/components/brand/maxime-home-logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useOnboardingComplete } from "@/hooks/use-onboarding-complete";
import { cn } from "@/lib/utils";

type NavbarProps = {
  /** When set, hash/solution links stay on that route instead of `/`. */
  hashRoot?: string;
  logoHref?: string;
  stickyTopClassName?: string;
};

function hashHref(hashRoot: string, hash: string) {
  return hashRoot === "/" ? `/${hash}` : `${hashRoot}${hash}`;
}

function buildNavLinks(hashRoot: string) {
  return [
    { href: hashHref(hashRoot, "#how-it-works"), label: "How it works" },
    { href: hashHref(hashRoot, "#features"), label: "Features" },
    { href: hashHref(hashRoot, "#compare"), label: "Why Maxime" },
    { href: hashHref(hashRoot, "#faq"), label: "FAQ" },
  ];
}

function buildSolutionLinks(hashRoot: string) {
  const base = hashRoot === "/" ? "/" : hashRoot;
  return [
    {
      href: `${base}?solution=collegiate#solutions`,
      label: "Collegiate esports",
      icon: GraduationCap,
    },
    {
      href: `${base}?solution=grassroots#solutions`,
      label: "Grassroots esports",
      icon: Users,
    },
  ];
}

export function Navbar({
  hashRoot = "/",
  logoHref = "/",
  stickyTopClassName,
}: NavbarProps = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const { showDashboard } = useOnboardingComplete();

  const links = buildNavLinks(hashRoot);
  const preSolutionLinks = links.slice(0, 1);
  const postSolutionLinks = links.slice(1);
  const solutionLinks = buildSolutionLinks(hashRoot);

  const resolveHref = (href: string) => {
    const isLocalRoot =
      pathname === hashRoot || (hashRoot === "/" && pathname === "/");
    if (!isLocalRoot) return href;

    if (hashRoot !== "/" && href.startsWith(hashRoot)) {
      const rest = href.slice(hashRoot.length);
      if (rest.startsWith("?") || rest.startsWith("#") || rest === "") {
        return rest || "#";
      }
    }

    // Production-style `/#section` or `/?solution=…#solutions`
    if (href.startsWith("/?") || href.startsWith("/#")) {
      return href.slice(1);
    }

    if (href.includes("#")) return href.slice(href.indexOf("#"));
    return href;
  };

  return (
    <header
      className={cn(
        "sticky z-50 overflow-visible border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md",
        stickyTopClassName ?? "top-0",
      )}
    >
      <Container className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 py-2">
        <div className="shrink-0 justify-self-start overflow-visible">
          <MaximeHomeLogo href={logoHref} />
        </div>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {preSolutionLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" &&
                pathname.startsWith(link.href.split("#")[0] || link.href) &&
                !link.href.includes("#"));
            return (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                className={cn(
                  "rounded-none px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
                  active
                    ? "text-[var(--foreground)]"
                    : "text-[var(--foreground-muted)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-none px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--foreground-muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]"
            >
              Solutions
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-1 opacity-0 shadow-none transition-all group-hover:visible group-hover:opacity-100">
              {solutionLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={resolveHref(link.href)}
                    className="flex items-center gap-2 rounded-none px-3 py-2 text-sm text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                  >
                    <Icon className="h-4 w-4 text-[var(--accent)]" />
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
                pathname.startsWith(link.href.split("#")[0] || link.href) &&
                !link.href.includes("#"));
            return (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                className={cn(
                  "rounded-none px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
                  active
                    ? "text-[var(--foreground)]"
                    : "text-[var(--foreground-muted)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]",
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
              <Button href="/sign-in" variant="ghost" size="sm" className="text-[var(--foreground)]">
                Sign in
              </Button>
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
                    className="hidden rounded-none px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--foreground-muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)] sm:inline"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <span
                    className="hidden min-w-[5.5rem] sm:inline"
                    aria-hidden
                  />
                )}
                <ClerkUserButton avatarClassName="h-8 w-8 shrink-0 ring-1 ring-[var(--border)]" />
              </div>
            </SignedIn>
          </div>

          <button
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-none text-[var(--foreground-muted)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--background)] md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {preSolutionLinks.map((link) => (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                onClick={() => {
                  setOpen(false);
                  setMobileSolutionsOpen(false);
                }}
                className="rounded-md px-3 py-2 text-sm text-[var(--foreground-muted)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setMobileSolutionsOpen((value) => !value)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-[var(--foreground-muted)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]"
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
              <div className="ml-3 flex flex-col gap-1 border-l border-[var(--border)] pl-3">
                {solutionLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={resolveHref(link.href)}
                      onClick={() => {
                        setOpen(false);
                        setMobileSolutionsOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--foreground-muted)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]"
                    >
                      <Icon className="h-4 w-4 text-[var(--accent)]" />
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
                className="rounded-md px-3 py-2 text-sm text-[var(--foreground-muted)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <SignedOut>
                <Button
                  href="/sign-in"
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-[var(--foreground)]"
                >
                  Sign in
                </Button>
                <Button href="/sign-up" variant="primary" size="sm" className="flex-1">
                  Get started
                </Button>
              </SignedOut>
              <SignedIn>
                {showDashboard ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-none px-3 py-2 text-center text-sm text-[var(--foreground-muted)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]"
                  >
                    Dashboard
                  </Link>
                ) : null}
                <div className="flex items-center justify-end px-2">
                  <ClerkUserButton avatarClassName="h-8 w-8 ring-1 ring-[var(--border)]" />
                </div>
              </SignedIn>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
