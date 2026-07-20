"use client";

import { Button } from "@/components/ui/button";

export function RouteErrorRecovery({
  title = "Something went wrong",
  description = "We couldn't load this page. Try again, or return home.",
  secondaryHref = "/?browse=1",
  secondaryLabel = "View homepage",
  retryHref,
  primaryHref,
  primaryLabel = "Go to dashboard",
  reset,
}: {
  title?: string;
  description?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  retryHref?: string;
  primaryHref?: string;
  primaryLabel?: string;
  reset: () => void;
}) {
  function retry() {
    if (retryHref) {
      window.location.assign(retryHref);
      return;
    }
    reset();
  }

  return (
    <div className="oc-hero-field flex flex-1 items-center justify-center px-6 py-24">
      <div className="oc-ink-frame w-full max-w-md space-y-4 p-8 text-center">
        <p className="oc-kicker">Error</p>
        <h1 className="font-heading text-2xl font-medium tracking-tight text-[var(--foreground)]">
          {title}
        </h1>
        <p className="text-sm leading-7 text-[var(--foreground-muted)]">{description}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {primaryHref ? (
            <Button type="button" onClick={() => window.location.assign(primaryHref)}>
              {primaryLabel}
            </Button>
          ) : null}
          <Button type="button" variant={primaryHref ? "outline" : "primary"} onClick={retry}>
            Try again
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.assign(secondaryHref)}
          >
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
