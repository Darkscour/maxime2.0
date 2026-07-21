import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Home navbar lockup — abstract schematic controller mark + wordmark.
 * Test-only: marketing nav top-left. Other surfaces keep the PNG lockup.
 *
 * Mark: a geometric, split-shell abstraction of a game controller,
 * inspired by the blueprint/schematic aesthetic of the features section.
 * Designed with generous negative space and a sharp central core.
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
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        {/*
          Abstract, schematic controller:
          - Split-shell design inspired by the feature art's geometric style
          - Generous negative space so buttons aren't crowded by the outline
          - A sharp diamond core and alignment dots anchor the center
        */}
        {/* Left Shell */}
        <path d="M 9 4 H 8 A 7 7 0 0 0 1 11 V 15 A 7 7 0 0 0 8 22 H 9" />
        
        {/* Right Shell */}
        <path d="M 17 4 H 18 A 7 7 0 0 1 25 11 V 15 A 7 7 0 0 1 18 22 H 17" />
        
        {/* Central Core (Diamond) */}
        <path d="M 13 10.5 L 15 13 L 13 15.5 L 11 13 Z" fill="currentColor" stroke="none" />
        
        {/* Alignment Dots */}
        <circle cx="13" cy="4" r="1" fill="currentColor" stroke="none" />
        <circle cx="13" cy="22" r="1" fill="currentColor" stroke="none" />
        
        {/* D-pad (Left) */}
        <path d="M 5 11 V 15 M 3 13 H 7" />
        
        {/* Action Buttons (Right) */}
        <circle cx="19.5" cy="11.5" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="22.5" cy="14.5" r="1.25" fill="currentColor" stroke="none" />
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
