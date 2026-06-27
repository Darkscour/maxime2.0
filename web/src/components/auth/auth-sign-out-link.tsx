"use client";

import { ClerkSignOutButton } from "@/components/auth/clerk-sign-out-button";

export function AuthSignOutLink({
  redirectUrl,
  className,
  children,
}: {
  redirectUrl: string;
  className?: string;
  children: string;
}) {
  return (
    <ClerkSignOutButton redirectUrl={redirectUrl}>
      <span className={className}>{children}</span>
    </ClerkSignOutButton>
  );
}
