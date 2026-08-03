"use client";

import { usePathname } from "next/navigation";

const APP_PREFIXES = ["/dashboard", "/onboarding", "/preview"];

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

/** Sign-in / create-org / privacy follow the home light/dark preference. */
function isHomeThemeRoute(pathname: string) {
  return (
    isHomeRoute(pathname) ||
    isAuthRoute(pathname) ||
    pathname === "/privacy" ||
    pathname.startsWith("/privacy/")
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

/** Sync home theme onto auth + privacy (home already mounts its own hook). */
export function HomeThemeOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!isHomeThemeRoute(pathname) || isHomeRoute(pathname)) return null;
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
