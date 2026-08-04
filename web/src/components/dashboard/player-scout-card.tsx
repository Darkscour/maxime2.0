import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/profile-avatar";

export type PlayerScoutCardProps = {
  handle: string;
  game: string;
  role: string;
  rank: string;
  region?: string | null;
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

  return (
    <ProfileAvatar
      src={imageUrl}
      size={48}
      className="ring-1 ring-inset ring-[var(--md-card-border)] bg-[var(--md-primary)]"
      fallback={
        <span
          className="font-heading text-lg font-bold text-white"
          aria-hidden
        >
          {initial}
        </span>
      }
    />
  );
}

export function PlayerScoutCard({
  handle,
  game,
  role,
  rank,
  region,
  school,
  imageUrl,
  className,
  badge,
}: PlayerScoutCardProps) {
  const location = region?.trim() || school?.trim() || game;
  const detailLine = [location, role, rank].filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "flex items-start gap-4",
        className,
      )}
    >
      <PlayerScoutCardAvatar handle={handle || "Player"} imageUrl={imageUrl} />
      <div className="min-w-0 flex-1">
        {badge && (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--md-accent)]">
            {badge}
          </p>
        )}
        <h2 className="font-heading text-lg font-semibold text-[var(--md-text)]">
          {handle || "Your handle"}
        </h2>
        <p className="mt-1 text-sm text-[var(--md-text-muted)]">
          {detailLine || "Competitive details"}
        </p>
        {school && region && (
          <p className="mt-2 text-xs text-[var(--md-text-faint)]">{school}</p>
        )}
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
      className="group block transition-colors"
    >
      <PlayerScoutCard
        {...props}
        className={cn(
          "transition-colors group-hover:opacity-90",
          props.className,
        )}
      />
    </Link>
  );
}
