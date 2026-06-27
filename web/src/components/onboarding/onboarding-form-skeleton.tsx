export function OnboardingFormSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-hidden>
      <div className="h-4 w-32 rounded bg-white/10" />
      <div className="space-y-3">
        <div className="h-3 w-24 rounded bg-cyan-400/20" />
        <div className="h-9 w-3/4 max-w-md rounded bg-white/10" />
        <div className="h-5 w-full max-w-xl rounded bg-white/5" />
      </div>
      <div className="space-y-4 rounded-2xl border border-white/5 p-5">
        <div className="h-4 w-48 rounded bg-white/10" />
        <div className="h-11 w-full rounded-lg bg-white/10" />
        <div className="h-11 w-full rounded-lg bg-white/10" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="h-11 w-full rounded-lg bg-white/10" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-11 rounded-lg bg-white/10" />
          <div className="h-11 rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="h-12 w-48 rounded-full bg-white/10" />
    </div>
  );
}
