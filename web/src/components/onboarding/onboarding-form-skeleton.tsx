export function OnboardingFormSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-hidden>
      <div className="h-4 w-32 rounded-none bg-[var(--border)]" />
      <div className="space-y-3">
        <div className="h-3 w-24 rounded-none bg-[color-mix(in_srgb,var(--accent)_20%,transparent)]" />
        <div className="h-9 w-3/4 max-w-md rounded-none bg-[var(--border)]" />
        <div className="h-5 w-full max-w-xl rounded-none bg-[var(--surface)]" />
      </div>
      <div className="space-y-4 rounded-none border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="h-4 w-48 rounded-none bg-[var(--border)]" />
        <div className="h-11 w-full rounded-none bg-[var(--border)]" />
        <div className="h-11 w-full rounded-none bg-[var(--border)]" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-40 rounded-none bg-[var(--border)]" />
        <div className="h-11 w-full rounded-none bg-[var(--border)]" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-11 rounded-none bg-[var(--border)]" />
          <div className="h-11 rounded-none bg-[var(--border)]" />
        </div>
      </div>
      <div className="h-12 w-48 rounded-none bg-[var(--border)]" />
    </div>
  );
}
