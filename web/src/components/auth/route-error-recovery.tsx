"use client";

import { Button } from "@/components/ui/button";

export function RouteErrorRecovery({
  title = "Something went wrong",
  description = "We couldn't load this page. Try again, or return home.",
  secondaryHref = "/?browse=1",
  secondaryLabel = "View homepage",
  reset,
}: {
  title?: string;
  description?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="font-heading text-2xl font-semibold text-white">{title}</h1>
        <p className="text-sm leading-7 text-zinc-400">{description}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button type="button" onClick={reset}>
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
