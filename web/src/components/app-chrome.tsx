"use client";

import { usePathname } from "next/navigation";

const APP_PREFIXES = ["/dashboard", "/onboarding"];

function isAppShellRoute(pathname: string) {
  return APP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Home uses Overcast Ink Frame chrome (FrameNav / FrameFooter). */
function isHomeRoute(pathname: string) {
  return pathname === "/";
}

function isAuthRoute(pathname: string) {
  return (
    pathname === "/sign-in" ||
    pathname.startsWith("/sign-in/") ||
    pathname === "/sign-up" ||
    pathname.startsWith("/sign-up/") ||
    pathname.startsWith("/auth/")
  );
}

export function AppShellOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!isAppShellRoute(pathname)) return null;
  return <>{children}</>;
}

export function MarketingOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isAppShellRoute(pathname) || isHomeRoute(pathname) || isAuthRoute(pathname)) {
    return null;
  }
  return <>{children}</>;
}

/** Minimal chrome on sign-in, sign-up, and post-auth handoff routes. */
export function AuthOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!isAuthRoute(pathname)) return null;
  return <>{children}</>;
}

/** Site footer — hidden on auth pages for a cleaner centered layout. */
export function MarketingFooterOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isAppShellRoute(pathname) || isHomeRoute(pathname) || isAuthRoute(pathname)) {
    return null;
  }
  return <>{children}</>;
}
