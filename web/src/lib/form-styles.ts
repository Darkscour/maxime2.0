import { cn } from "@/lib/utils";

/** Shared field styling for onboarding, settings, and dashboard filters. */
export const fieldClassName =
  "w-full rounded-lg border border-white/10 bg-[var(--background)] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/10";

export const selectClassName = cn(
  fieldClassName,
  "cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10",
);

export const selectChevronStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
};
