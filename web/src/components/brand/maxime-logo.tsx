import Link from "next/link";
import { cn } from "@/lib/utils";

/** Full stacked lockup: emblem above the MAXIME wordmark (transparent). */
const STACKED_SRC = "/maxime-logo-stacked.png";
const STACKED_W = 387;
const STACKED_H = 355;

/** Emblem-only crop for compact mark contexts. */
const MARK_SRC = "/maxime-mark.png";

const stackedHeight = {
  sm: 32,
  md: 40,
  lg: 72,
} as const;

const markSize = {
  sm: 28,
  md: 32,
  lg: 48,
} as const;

type MaximeLogoProps = {
  /** `stacked` (default): emblem + MAXIME wordmark. `mark`: emblem only. */
  variant?: "stacked" | "mark";
  size?: keyof typeof stackedHeight;
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function MaximeLogo({
  variant = "stacked",
  size = "md",
  href = "/",
  className,
  priority = false,
}: MaximeLogoProps) {
  let content: React.ReactNode;

  if (variant === "mark") {
    const side = markSize[size];
    content = (
      // Native img — avoids Vercel/Next image optimizer clipping transparent PNG lockups.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={MARK_SRC}
        alt="Maxime"
        width={side}
        height={side}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={cn("block shrink-0 object-contain", className)}
        style={{ width: side, height: side }}
      />
    );
  } else {
    const h = stackedHeight[size];
    const w = Math.round(h * (STACKED_W / STACKED_H));
    content = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={STACKED_SRC}
        alt="Maxime"
        width={w}
        height={h}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={cn("block shrink-0 object-contain", className)}
        style={{ width: w, height: h }}
      />
    );
  }

  if (href === null) return <>{content}</>;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center overflow-visible leading-none"
    >
      {content}
    </Link>
  );
}
