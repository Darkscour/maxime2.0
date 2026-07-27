import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DeskPageHeader({
  title,
  job,
  action,
  className,
}: {
  title: string;
  job: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("md-subpage-header", className)}>
      <div className="min-w-0 max-w-2xl">
        <h1 className="md-subpage-title sm:text-[2rem]">{title}</h1>
        <p className="md-subpage-job">{job}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function DeskEmpty({
  title,
  body,
  actionLabel,
  actionHref,
  className,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("md-subpage-empty", className)}>
      <p className="font-heading text-lg font-semibold tracking-[-0.01em] text-[var(--md-text)]">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--md-text-muted)]">
        {body}
      </p>
      {actionLabel && actionHref ? (
        <Button href={actionHref} size="sm" className="mt-5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export type DeskTicketItem = {
  id: string;
  title: string;
  body: string;
  actionLabel: string;
  href: string;
};

export function DeskQueue({
  tickets,
  emptyTitle,
  emptyBody,
  emptyActionLabel,
  emptyActionHref,
  className,
}: {
  tickets: DeskTicketItem[];
  emptyTitle: string;
  emptyBody: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
  className?: string;
}) {
  return (
    <section className={cn("md-subpage-panel", className)} aria-label="Today's desk">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--md-card-border)] pb-3">
        <p className="md-subpage-kicker">Today&apos;s desk</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--md-text-faint)]">
          {tickets.length === 0 ? "Clear" : `${tickets.length} open`}
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-heading text-base font-semibold text-[var(--md-text)]">
            {emptyTitle}
          </p>
          <p className="mt-2 max-w-lg mx-auto text-sm text-[var(--md-text-muted)]">{emptyBody}</p>
          {emptyActionLabel && emptyActionHref ? (
            <Link
              href={emptyActionHref}
              className="mt-4 inline-flex rounded-md border border-[var(--md-card-border)] bg-[var(--md-chip-bg)] px-3 py-2 text-sm font-semibold text-[var(--md-text)] transition-colors hover:border-[var(--md-accent)] hover:text-[var(--md-accent)]"
            >
              {emptyActionLabel}
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-[var(--md-card-border)]">
          {tickets.map((ticket, index) => (
            <li
              key={ticket.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
            >
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-[var(--md-text)]">
                  {ticket.title}
                </p>
                <p className="mt-1 text-sm text-[var(--md-text-muted)]">{ticket.body}</p>
              </div>
              <Link
                href={ticket.href}
                className="md-btn md-btn-primary shrink-0"
              >
                {ticket.actionLabel}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function DeskPlate({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <aside className={cn("md-subpage-panel", className)}>{children}</aside>;
}

export function DeskPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("md-subpage-panel", className)}>{children}</div>;
}
