"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const SOLUTION_LINKS = [
  {
    href: "/solutions/collegiate",
    label: "Collegiate esports",
    description: "Campus programs, school-scoped scouting, sponsors",
    icon: GraduationCap,
  },
  {
    href: "/solutions/grassroots",
    label: "Grassroots esports",
    description: "Community teams, regional scouting, duels",
    icon: Users,
  },
] as const;

export function SolutionsNavDropdown({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Solutions
        </span>
        {SOLUTION_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors",
          open
            ? "bg-white/5 text-white"
            : "text-zinc-400 hover:bg-white/5 hover:text-white",
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Solutions
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-white/10 bg-[var(--background)]/95 p-2 shadow-xl backdrop-blur-xl">
          {SOLUTION_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/20">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-white">
                    {link.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
                    {link.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
