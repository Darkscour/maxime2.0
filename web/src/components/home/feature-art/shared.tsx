/**
 * Shared visual language for feature illustrations.
 *
 * Every illustration uses the same outer frame (rounded panel + faint grid +
 * subtle accent glow) so the section reads as one designed family rather than
 * seven loose drawings. Keep new illustrations consistent by:
 *   - 1.5px strokes on structural lines (use `STROKE_BASE` / `STROKE_ACCENT`)
 *   - one accent color "pop" per illustration (copper accent or accent-2, not both)
 *   - SVG `viewBox` set to "0 0 400 240" for pillars, "0 0 240 140" for
 *     secondary cards
 *   - `fill="none"` on every shape unless you specifically want a tinted fill
 */

import { cn } from "@/lib/utils";

export type Accent = "cyan" | "violet";

export const STROKE_BASE = "stroke-[var(--foreground-subtle)]";
export const STROKE_BASE_SOFT = "stroke-[var(--border-strong)]";
export const STROKE_CYAN = "stroke-[var(--accent)]";
export const STROKE_VIOLET = "stroke-[var(--accent-2)]";

export const FILL_CYAN_SOFT = "fill-[color-mix(in_srgb,var(--accent)_10%,transparent)]";
export const FILL_VIOLET_SOFT = "fill-[color-mix(in_srgb,var(--accent-2)_10%,transparent)]";

const ACCENT_GLOW: Record<Accent, string> = {
  cyan: "before:bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_70%)]",
  violet:
    "before:bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--accent-2)_12%,transparent),transparent_70%)]",
};

export function IllustrationFrame({
  accent,
  children,
  className,
}: {
  accent: Accent;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--foreground)_3.5%,transparent)]",
        "before:absolute before:inset-0 before:opacity-80 before:content-['']",
        ACCENT_GLOW[accent],
        className,
      )}
    >
      <div
        className="bg-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
