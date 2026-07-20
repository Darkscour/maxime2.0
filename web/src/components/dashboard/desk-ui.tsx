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
    <header
      className={cn(
        "flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-strong)] pb-5",
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        <h1 className="font-heading text-[1.75rem] font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-[2rem]">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">{job}</p>
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
    <div
      className={cn(
        "desk-sheet border-dashed px-6 py-10 text-center sm:px-10",
        className,
      )}
    >
      <p className="font-heading text-lg font-semibold tracking-[-0.01em] text-[var(--foreground)]">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
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
    <section className={cn("desk-queue", className)} aria-label="Today's desk">
      <div className="desk-queue-header">
        <p className="desk-kicker">Today&apos;s desk</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
          {tickets.length === 0
            ? "Clear"
            : `${tickets.length} open`}
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="desk-queue-empty">
          <p className="font-heading text-base font-semibold text-[var(--foreground)]">
            {emptyTitle}
          </p>
          <p className="mt-2 max-w-lg text-[var(--foreground-muted)]">{emptyBody}</p>
          {emptyActionLabel && emptyActionHref ? (
            <Link
              href={emptyActionHref}
              className="mt-4 inline-flex border border-[var(--border-strong)] bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {emptyActionLabel}
            </Link>
          ) : null}
        </div>
      ) : (
        tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="desk-ticket desk-ticket-enter"
            style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
          >
            <div className="min-w-0">
              <p className="desk-ticket-title">{ticket.title}</p>
              <p className="desk-ticket-body">{ticket.body}</p>
            </div>
            <Link
              href={ticket.href}
              className="inline-flex shrink-0 items-center justify-center border border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-strong)] hover:border-[var(--accent-strong)]"
            >
              {ticket.actionLabel}
            </Link>
          </div>
        ))
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
  return <aside className={cn("desk-plate", className)}>{children}</aside>;
}
