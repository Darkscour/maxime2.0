import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Home navbar lockup — copper-gold mark + wordmark.
 * Test-only: marketing nav top-left. Other surfaces keep the PNG lockup.
 *
 * Mark: a solid “M” with uneven stem weights and a shallow center notch —
 * the kind of optical tweak a designer makes by eye, not a perfect grid.
 */
export function MaximeHomeLogo({
  href = "/",
  className,
}: {
  href?: string | null;
  className?: string;
}) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-[0.65rem] text-[var(--accent)]",
        className,
      )}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        {/*
          Coordinates tuned by eye:
          - left stem slightly heavier than right
          - apex sits off true center (13.2, not 13)
          - inner notch stops short of the baseline for weight
        */}
        <path d="M3.5 22V4.2h3.35l6.35 11.55L19.4 4.2H22.5V22h-3.1V10.15L14.05 19.4h-1.85L6.6 10.15V22H3.5Z" />
      </svg>
      <span className="font-heading text-[1.15rem] font-medium leading-none tracking-[-0.035em]">
        Maxime
      </span>
    </span>
  );

  if (href === null) return content;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center overflow-visible leading-none transition-opacity hover:opacity-75"
      aria-label={href === "/dashboard" ? "Maxime desk" : "Maxime home"}
    >
      {content}
    </Link>
  );
}
