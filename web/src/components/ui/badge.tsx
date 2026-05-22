import { cn } from "@/lib/utils";

type Tone = "cyan" | "violet" | "zinc" | "green" | "amber";

const tones: Record<Tone, string> = {
  cyan: "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/30",
  violet:
    "bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/30",
  zinc: "bg-zinc-400/10 text-zinc-300 ring-1 ring-inset ring-zinc-400/20",
  green: "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30",
  amber: "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/30",
};

export function Badge({
  children,
  tone = "cyan",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
