import { ManagerDashboardPreview } from "@/components/marketing/manager-dashboard-preview";
import { cn } from "@/lib/utils";

export function HeroDashboardMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "gradient-border rounded-2xl bg-[var(--surface)]/80 p-2 shadow-2xl shadow-[0_25px_50px_-12px_var(--accent-glow)] backdrop-blur",
        className,
      )}
    >
      <div className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--background)]">
        <div className="border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 text-xs text-[var(--foreground-subtle)]">maxime.com/dashboard</span>
          </div>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--background)]">
          <div className="pointer-events-none absolute left-0 top-0 w-[168%] origin-top-left scale-[calc(1/1.68)]">
            <ManagerDashboardPreview
              variant="hero"
              showSidebar={false}
              showTopBar={false}
              className="min-h-[560px] rounded-none border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
