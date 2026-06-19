"use client";

import { SignOutButton } from "@clerk/nextjs";

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
    <SignOutButton redirectUrl={redirectUrl}>
      <span className={className}>{children}</span>
    </SignOutButton>
  );
}
