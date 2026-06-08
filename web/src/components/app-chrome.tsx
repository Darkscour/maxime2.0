"use client";

import { usePathname } from "next/navigation";

const APP_PREFIXES = ["/dashboard", "/onboarding"];

function isAppShellRoute(pathname: string) {
  return APP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function AppShellOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!isAppShellRoute(pathname)) return null;
  return <>{children}</>;
}

export function MarketingOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isAppShellRoute(pathname)) return null;
  return <>{children}</>;
}
