"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const SUPABASE_STATUS_URL = "https://status.supabase.com";

export function DbUnavailableRecovery({
  title = "Account verification temporarily unavailable",
  description = "We couldn't reach the database right now. This is usually temporary — wait a minute and try again. Your sign-in and account have not been affected.",
  retryHref = "/auth/continue?intent=sign-in",
  secondaryHref = "/?browse=1",
  secondaryLabel = "View homepage",
}: {
  title?: string;
  description?: string;
  retryHref?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="w-full text-center">
      <p className="oc-kicker mb-3">Temporary issue</p>
      <h1 className="font-heading text-2xl font-medium tracking-tight text-[var(--foreground)]">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">{description}</p>
      <p className="mt-2 text-xs text-[var(--foreground-subtle)]">
        Try again in about a minute. You can also check{" "}
        <Link
          href={SUPABASE_STATUS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
        >
          Supabase status
        </Link>{" "}
        for platform updates.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={() => window.location.assign(retryHref)}
        >
          Try again
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => window.location.assign(secondaryHref)}
        >
          {secondaryLabel}
        </Button>
      </div>
    </div>
  );
}
