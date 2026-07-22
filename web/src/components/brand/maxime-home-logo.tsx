import { MaximeLogo } from "@/components/brand/maxime-logo";

/**
 * Home / desk / auth navbar lockup — copper mark + Maxime wordmark.
 * Thin wrapper around MaximeLogo so all surfaces share one brand asset.
 */
export function MaximeHomeLogo({
  href = "/",
  className,
}: {
  href?: string | null;
  className?: string;
}) {
  return (
    <MaximeLogo
      variant="lockup"
      size="nav"
      href={href}
      className={className}
      priority
    />
  );
}
