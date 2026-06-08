import Link from "next/link";
import { cn } from "@/lib/utils";

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
          <p className="font-heading mt-2 text-2xl font-semibold text-white">{value}</p>
          {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
          <Icon className="h-4 w-4 text-cyan-400" />
        </span>
      </div>
    </div>
  );
}

export function FeatureTile({
  href,
  title,
  description,
  icon: Icon,
  tone = "cyan",
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "cyan" | "violet";
}) {
  const iconClass = tone === "cyan" ? "text-cyan-400" : "text-violet-400";
  const hoverRing =
    tone === "cyan"
      ? "hover:border-cyan-400/25 hover:bg-cyan-400/[0.03]"
      : "hover:border-violet-400/25 hover:bg-violet-400/[0.03]";

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-5 transition-colors",
        hoverRing,
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
        <Icon className={cn("h-4 w-4", iconClass)} />
      </span>
      <h3 className="font-heading mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{description}</p>
      <span className="mt-4 text-sm font-medium text-zinc-300 group-hover:text-white">
        Open →
      </span>
    </Link>
  );
}
