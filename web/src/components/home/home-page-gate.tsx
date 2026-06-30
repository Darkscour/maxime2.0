"use client";

export function HomePageGate({
  children,
}: {
  browsing: boolean;
  children: React.ReactNode;
}) {
  // The marketing homepage must remain stable for signed-in users too; account
  // routing happens from explicit dashboard/sign-in actions.
  return <>{children}</>;
}

