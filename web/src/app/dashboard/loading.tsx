function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-none bg-[var(--surface-2)] ${className ?? ""}`}
      aria-hidden
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8" aria-busy="true" aria-label="Loading">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-strong)] pb-5">
        <div className="min-w-0 max-w-2xl space-y-3">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-8 w-56 max-w-full" />
          <SkeletonBlock className="h-4 w-80 max-w-full" />
        </div>
        <SkeletonBlock className="h-9 w-28 shrink-0" />
      </header>

      <div className="desk-sheet space-y-4 p-5 sm:p-6">
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-3/4" />
      </div>
    </div>
  );
}
