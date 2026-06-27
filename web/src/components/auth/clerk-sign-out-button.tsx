"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useState, type ReactNode } from "react";

/** Sign-out control that waits for client mount (avoids ClerkProvider SSR errors). */
export function ClerkSignOutButton({
  redirectUrl = "/sign-in",
  onClick,
  className,
  children,
}: {
  redirectUrl?: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button type="button" disabled className={className}>
        {children}
      </button>
    );
  }

  return (
    <SignOutButton redirectUrl={redirectUrl}>
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    </SignOutButton>
  );
}
