import Link from "next/link";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "role", label: "Role", match: ["/onboarding"] },
  { id: "profile", label: "Profile", match: ["/onboarding/team", "/onboarding/player", "/onboarding/join"] },
  { id: "done", label: "Done", match: ["/onboarding/done"] },
] as const;

export function OnboardingProgress({ pathname }: { pathname: string }) {
  const activeIndex = STEPS.findIndex((step) =>
    step.match.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ),
  );
  const current = activeIndex === -1 ? 0 : activeIndex;

  return (
    <nav aria-label="Onboarding progress" className="mb-10">
      <ol className="flex items-center gap-2">
        {STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-inset transition-colors",
                    done && "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
                    active && "bg-cyan-400/15 text-cyan-200 ring-cyan-400/35",
                    !done && !active && "bg-white/[0.03] text-zinc-500 ring-white/10",
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-white" : "text-zinc-500",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mb-5 h-px flex-1",
                    index < current ? "bg-emerald-400/30" : "bg-white/10",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function OnboardingBackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex text-sm text-zinc-500 transition-colors hover:text-zinc-300"
    >
      {children}
    </Link>
  );
}
