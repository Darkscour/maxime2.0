import Link from "next/link";
import { cn } from "@/lib/utils";

export type PlayerScoutCardProps = {
  handle: string;
  game: string;
  role: string;
  rank: string;
  school?: string | null;
  imageUrl?: string | null;
  className?: string;
  badge?: string;
};

function PlayerScoutCardAvatar({
  handle,
  imageUrl,
}: {
  handle: string;
  imageUrl?: string | null;
}) {
  const initial = handle.trim().charAt(0).toUpperCase() || "?";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="h-12 w-12 shrink-0 rounded-none object-cover ring-1 ring-inset ring-[var(--border)]"
      />
    );
  }

  return (
    <span
      className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-[var(--foreground)] text-lg font-bold text-[var(--background)]"
      aria-hidden
    >
      {initial}
    </span>
  );
}

export function PlayerScoutCard({
  handle,
  game,
  role,
  rank,
  school,
  imageUrl,
  className,
  badge,
}: PlayerScoutCardProps) {
  const detailLine = [game, role, rank].filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "flex items-start gap-4 rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-5",
        className,
      )}
    >
      <PlayerScoutCardAvatar handle={handle || "Player"} imageUrl={imageUrl} />
      <div className="min-w-0 flex-1">
        {badge && (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            {badge}
          </p>
        )}
        <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">
          {handle || "Your handle"}
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          {detailLine || "Competitive details"}
        </p>
        {school && <p className="mt-2 text-xs text-[var(--foreground-muted)]">{school}</p>}
      </div>
    </article>
  );
}

export function PlayerScoutCardLink({
  href,
  ...props
}: PlayerScoutCardProps & { href: string }) {
  return (
    <Link
      href={href}
      className="group block transition-colors hover:[&_article]:border-[var(--accent-2)]"
    >
      <PlayerScoutCard
        {...props}
        className={cn(
          "transition-colors group-hover:bg-[var(--surface-2)]",
          props.className,
        )}
      />
    </Link>
  );
}
