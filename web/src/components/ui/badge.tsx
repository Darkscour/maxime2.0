import { cn } from "@/lib/utils";

/** Legacy tone names kept for call-site compatibility; mapped to Overcast ink/copper. */
type Tone = "cyan" | "violet" | "zinc" | "green" | "amber" | "copper" | "ink";

const tones: Record<Tone, string> = {
  cyan: "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]",
  violet:
    "bg-[color-mix(in_srgb,var(--accent-2)_10%,transparent)] text-[var(--accent-2)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent-2)_30%,transparent)]",
  copper:
    "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]",
  ink: "bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] text-[var(--foreground)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--foreground)_18%,transparent)]",
  zinc: "bg-[color-mix(in_srgb,var(--foreground-muted)_10%,transparent)] text-[var(--foreground-muted)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--foreground-muted)_20%,transparent)]",
  green: "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--success)_28%,transparent)]",
  amber: "bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] text-[var(--warning)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--warning)_28%,transparent)]",
};

export function Badge({
  children,
  tone = "copper",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-none px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
