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
        className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-inset ring-white/10"
      />
    );
  }

  return (
    <span
      className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/90 to-violet-500/90 text-lg font-bold text-zinc-950"
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
}: PlayerScoutCardProps) {
  const detailLine = [game, role, rank].filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "flex items-start gap-4 rounded-2xl border border-white/5 bg-[var(--surface)] p-5",
        className,
      )}
    >
      <PlayerScoutCardAvatar handle={handle || "Player"} imageUrl={imageUrl} />
      <div className="min-w-0 flex-1">
        <h2 className="font-heading text-lg font-semibold text-white">
          {handle || "Your handle"}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {detailLine || "Competitive details"}
        </p>
        {school && <p className="mt-2 text-xs text-zinc-500">{school}</p>}
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
      className="group block transition-colors hover:[&_article]:border-violet-400/25"
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
