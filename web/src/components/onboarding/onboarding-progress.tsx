import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "role", label: "Role" },
  { id: "tier", label: "Account type" },
  { id: "profile", label: "Profile" },
  { id: "done", label: "Done" },
] as const;

const CIRCLE_SIZE = 32; // h-8

function getActiveStepIndex(pathname: string): number {
  if (pathname === "/onboarding/done" || pathname.startsWith("/onboarding/done/")) {
    return 3;
  }

  if (pathname === "/onboarding/team/tier" || pathname === "/onboarding/player/tier") {
    return 1;
  }

  if (
    pathname === "/onboarding/team" ||
    pathname === "/onboarding/player" ||
    pathname === "/onboarding/join" ||
    pathname.startsWith("/onboarding/join/")
  ) {
    return 2;
  }

  return 0;
}

function connectorClass(leftStepIndex: number, activeIndex: number) {
  return leftStepIndex < activeIndex
    ? "bg-[var(--accent)]"
    : "bg-[var(--border)]";
}

export function OnboardingProgress({ pathname }: { pathname: string }) {
  const activeIndex = getActiveStepIndex(pathname);

  return (
    <nav aria-label="Onboarding progress" className="mb-10">
      <div className="mx-auto flex max-w-xs items-start sm:max-w-sm">
        {STEPS.map((step, index) => {
          const done = index < activeIndex;
          const active = index === activeIndex;

          return (
            <Fragment key={step.id}>
              {index > 0 && (
                <div
                  aria-hidden
                  className="flex flex-1 items-center px-2 sm:px-3"
                  style={{ height: CIRCLE_SIZE }}
                >
                  <div
                    className={cn(
                      "h-px w-full",
                      connectorClass(index - 1, activeIndex),
                    )}
                  />
                </div>
              )}

              <div className="flex w-14 shrink-0 flex-col items-center sm:w-16">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-none border text-xs font-semibold transition-colors",
                    done &&
                      "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]",
                    active &&
                      "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]",
                    !done &&
                      !active &&
                      "border-[var(--border)] text-[var(--foreground-muted)]",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "mt-2 whitespace-nowrap text-center font-mono text-[10px] font-medium uppercase tracking-[0.12em]",
                    active
                      ? "text-[var(--foreground)]"
                      : done
                        ? "text-[var(--accent)]"
                        : "text-[var(--foreground-muted)]",
                  )}
                >
                  {step.label}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
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
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
    >
      {children}
    </Link>
  );
}
