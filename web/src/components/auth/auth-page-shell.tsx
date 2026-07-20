import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AuthIntent } from "@/lib/auth-intent";
import {
  AUTH_PAGE_DESCRIPTION,
  AUTH_PAGE_TITLE,
  AUTH_TABS,
} from "@/lib/auth-page-config";

type AuthPageShellProps = {
  children: React.ReactNode;
  /** When set, renders the shared sign-in / sign-up tab layout. */
  intent?: AuthIntent;
  /** Quiet label above the title — use sparingly (e.g. error states). */
  kicker?: string;
  title?: string;
  description?: string;
};

export function AuthPageShell({
  children,
  intent,
  kicker,
  title,
  description,
}: AuthPageShellProps) {
  const isCredentialPage = intent === "sign-in" || intent === "sign-up";
  const heading = title ?? (isCredentialPage ? AUTH_PAGE_TITLE[intent] : undefined);
  const lead =
    description ?? (isCredentialPage ? AUTH_PAGE_DESCRIPTION[intent] : undefined);
  const hasHeader = Boolean(kicker || heading || lead);

  return (
    <div className="auth-page flex flex-1 items-center justify-center px-5 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="auth-card oc-ink-frame overflow-visible px-6 py-8 pb-10 sm:px-8 sm:py-9 sm:pb-11">
          {isCredentialPage ? (
            <nav
              className="auth-tabs mb-6 grid grid-cols-2 gap-px border border-[var(--border)] bg-[var(--border)]"
              aria-label="Account access"
            >
              {AUTH_TABS.map((tab) => {
                const active = tab.intent === intent;
                return (
                  <Link
                    key={tab.intent}
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-3 py-2.5 text-center text-sm font-medium transition-colors",
                      active
                        ? "bg-[var(--surface)] text-[var(--foreground)]"
                        : "bg-[var(--background)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
                    )}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}

          {hasHeader ? (
            <header
              className={cn(
                "space-y-2",
                isCredentialPage ? "mb-6 min-h-[3.25rem] sm:mb-7" : "mb-6 sm:mb-7",
              )}
            >
              {kicker ? (
                <p className="text-xs font-medium text-[var(--foreground-muted)]">{kicker}</p>
              ) : null}
              {heading ? (
                isCredentialPage ? (
                  <h1 className="sr-only">{heading}</h1>
                ) : (
                  <h1 className="font-heading text-[1.625rem] font-medium leading-tight tracking-tight text-[var(--foreground)] sm:text-[1.75rem]">
                    {heading}
                  </h1>
                )
              ) : null}
              {lead ? (
                <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">{lead}</p>
              ) : null}
            </header>
          ) : null}

          <div className="auth-clerk-host overflow-visible">{children}</div>
        </div>
      </div>
    </div>
  );
}
