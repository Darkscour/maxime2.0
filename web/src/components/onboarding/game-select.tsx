"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import {
  ONBOARDING_GAMES,
  getGameLogoPath,
  type PrimaryGame,
} from "@/lib/onboarding-options";
import { fieldClassName } from "@/lib/form-styles";
import { cn } from "@/lib/utils";

type GameSelectProps = {
  value: string;
  onChange: (game: PrimaryGame | "") => void;
  label?: string;
  hint?: string;
  required?: boolean;
};

function GameLogo({
  game,
  size = "sm",
}: {
  game: PrimaryGame;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const src = getGameLogoPath(game);

  return (
    <span
      className={cn(
        dim,
        "flex shrink-0 items-center justify-center overflow-hidden rounded-none",
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-contain" />
      ) : null}
    </span>
  );
}

export function GameSelect({
  value,
  onChange,
  label = "Primary game",
  hint = "Your main competitive title",
  required,
}: GameSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = value && ONBOARDING_GAMES.includes(value as PrimaryGame)
    ? (value as PrimaryGame)
    : null;

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function select(game: PrimaryGame) {
    onChange(game);
    setOpen(false);
  }

  function clear() {
    onChange("");
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="block">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-xs text-[var(--foreground-muted)]">
            {hint}
          </span>
        ) : (
          <span className="mt-0.5 block min-h-4" aria-hidden />
        )}

        {selected ? (
          <div className="mt-2 flex items-center gap-3 rounded-none border border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
            <GameLogo game={selected} />
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--foreground)]">
              {selected}
            </p>
            <button
              type="button"
              onClick={clear}
              className="rounded-none p-1 text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              aria-label="Clear game selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              fieldClassName,
              "mt-2 flex w-full items-center justify-between text-left text-[var(--foreground-muted)]",
            )}
            aria-expanded={open}
            aria-controls={listId}
          >
            <span>Select game</span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </button>
        )}
      </label>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-none border border-[var(--border)] bg-[var(--surface)] py-1 shadow-sm"
        >
          {ONBOARDING_GAMES.map((game) => (
            <li key={game} role="option" aria-selected={selected === game}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--background)]"
                onClick={() => select(game)}
              >
                <GameLogo game={game} />
                <span className="text-sm text-[var(--foreground)]">{game}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
