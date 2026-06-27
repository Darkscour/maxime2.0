import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Emblem-only crop (transparent background). */
const MARK_SRC = "/maxime-mark.png";
const MARK_W = 358;
const MARK_H = 270;

/** Full stacked lockup: emblem above the MAXIME wordmark (transparent). */
const STACK_SRC = "/maxime-logo.png";
const STACK_W = 386;
const STACK_H = 354;

const markHeight = {
  sm: 30,
  md: 36,
  lg: 44,
} as const;

const stackHeight = {
  sm: 64,
  md: 88,
  lg: 120,
} as const;

const wordmarkSize = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
} as const;

type MaximeLogoProps = {
  /**
   * `lockup` (default): emblem + "Maxime" text beside it — for nav, footer, dashboard.
   * `stacked`: large emblem-over-wordmark image — for spacious hero areas.
   */
  variant?: "lockup" | "stacked";
  size?: keyof typeof markHeight;
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function MaximeLogo({
  variant = "lockup",
  size = "md",
  href = "/",
  className,
  priority = false,
}: MaximeLogoProps) {
  let content: React.ReactNode;

  if (variant === "stacked") {
    const h = stackHeight[size];
    const w = Math.round(h * (STACK_W / STACK_H));
    content = (
      <Image
        src={STACK_SRC}
        alt="Maxime"
        width={w}
        height={h}
        priority={priority}
        unoptimized
        className={cn("block object-contain", className)}
        style={{ width: w, height: h }}
      />
    );
  } else {
    const h = markHeight[size];
    const w = Math.round(h * (MARK_W / MARK_H));
    content = (
      <span className={cn("inline-flex items-center gap-2.5", className)}>
        <Image
          src={MARK_SRC}
          alt=""
          width={w}
          height={h}
          priority={priority}
          unoptimized
          className="block shrink-0 object-contain"
          style={{ width: w, height: h }}
        />
        <span
          className={cn(
            "font-heading font-semibold uppercase tracking-[0.18em] text-white",
            wordmarkSize[size],
          )}
        >
          Maxime
        </span>
      </span>
    );
  }

  if (href === null) return <>{content}</>;

  return (
    <Link href={href} className="inline-flex items-center leading-none">
      {content}
    </Link>
  );
}
