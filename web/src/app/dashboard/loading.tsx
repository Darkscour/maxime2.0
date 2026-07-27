function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--md-chip-bg)] ${className ?? ""}`}
      aria-hidden
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <header className="md-subpage-header">
        <div className="min-w-0 max-w-2xl space-y-3">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-8 w-56 max-w-full" />
          <SkeletonBlock className="h-4 w-80 max-w-full" />
        </div>
        <SkeletonBlock className="h-9 w-28 shrink-0" />
      </header>

      <div className="md-subpage-panel space-y-4">
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-3/4" />
      </div>
    </div>
  );
}
