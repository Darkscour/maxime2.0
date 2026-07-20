import Link from "next/link";

type AuthPageShellProps = {
  children: React.ReactNode;
  /** Mono copper kicker above the brand, e.g. "SIGN IN" */
  kicker?: string;
  title?: string;
  description?: string;
  /** Footer link to the alternate auth flow */
  alternateHref?: string;
  alternateLabel?: string;
  alternateHint?: string;
};

export function AuthPageShell({
  children,
  kicker,
  title,
  description,
  alternateHref,
  alternateLabel,
  alternateHint,
}: AuthPageShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 text-center">
          {kicker ? <p className="oc-kicker mb-2">{kicker}</p> : null}
          {title ? (
            <h1 className="font-heading text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          ) : null}
        </div>

        <div>{children}</div>

        {alternateHref && alternateLabel ? (
          <p className="mt-6 text-center text-sm text-[var(--foreground-muted)]">
            {alternateHint ? `${alternateHint} ` : null}
            <Link
              href={alternateHref}
              className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              {alternateLabel}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
