import { Info } from "lucide-react";

/** Shown for any returning user with saved onboarding progress (not URL-dependent). */
export function OnboardingResumeBanner({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div
      className="mb-6 flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-3 text-sm text-cyan-100"
      role="status"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1 leading-6">
        You&apos;ve already signed up with this email but haven&apos;t finished
        onboarding yet. Pick up where you left off below.
      </p>
    </div>
  );
}
