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
    <div className="mx-auto max-w-6xl space-y-10" aria-busy="true" aria-label="Loading">
      <div className="space-y-4">
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-10 w-72 max-w-full" />
        <SkeletonBlock className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-28 rounded-none" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-64 rounded-none" />
        <SkeletonBlock className="h-64 rounded-none" />
      </div>
    </div>
  );
}
