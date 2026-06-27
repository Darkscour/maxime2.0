/**
 * Shared visual language for feature illustrations.
 *
 * Every illustration uses the same outer frame (rounded panel + faint grid +
 * subtle accent glow) so the section reads as one designed family rather than
 * seven loose drawings. Keep new illustrations consistent by:
 *   - 1.5px strokes on structural lines (use `STROKE_BASE` / `STROKE_ACCENT`)
 *   - one accent color "pop" per illustration (cyan or violet, not both)
 *   - SVG `viewBox` set to "0 0 400 240" for pillars, "0 0 240 140" for
 *     secondary cards
 *   - `fill="none"` on every shape unless you specifically want a tinted fill
 */

import { cn } from "@/lib/utils";

export type Accent = "cyan" | "violet";

export const STROKE_BASE = "stroke-zinc-500";
export const STROKE_BASE_SOFT = "stroke-zinc-700";
export const STROKE_CYAN = "stroke-cyan-400";
export const STROKE_VIOLET = "stroke-violet-400";

export const FILL_CYAN_SOFT = "fill-cyan-400/10";
export const FILL_VIOLET_SOFT = "fill-violet-400/10";

const ACCENT_GLOW: Record<Accent, string> = {
  cyan: "before:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.12),transparent_70%)]",
  violet:
    "before:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(167,139,250,0.12),transparent_70%)]",
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
        "relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.035]",
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
