"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Building2, Settings, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClassName, selectClassName, selectChevronStyle } from "@/lib/form-styles";

const inputClass = fieldClassName;

export function SettingsInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function SettingsTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      className={cn(inputClass, "min-h-[112px] resize-y leading-relaxed")}
      {...props}
    />
  );
}

export function SettingsSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      className={selectClassName}
      style={selectChevronStyle}
      {...props}
    />
  );
}

export function SettingsField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      {hint && (
        <span className="mt-0.5 block text-xs leading-5 text-zinc-500">{hint}</span>
      )}
      <div className="mt-2.5">{children}</div>
    </label>
  );
}

export function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  id,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]/90"
    >
      <div className="flex items-start gap-4 border-b border-white/[0.05] bg-white/[0.02] px-5 py-4 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/15 to-violet-500/10 ring-1 ring-inset ring-white/10">
          <Icon className="h-4 w-4 text-cyan-300" />
        </span>
        <div>
          <h2 className="font-heading text-base font-semibold text-white">{title}</h2>
          <p className="mt-0.5 text-sm leading-6 text-zinc-500">{description}</p>
        </div>
      </div>
      <div className="space-y-6 p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function SettingsChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-2 text-xs font-medium transition-all",
        active
          ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-inset ring-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
          : "bg-white/[0.03] text-zinc-400 ring-1 ring-inset ring-white/[0.08] hover:bg-white/[0.06] hover:text-zinc-200",
      )}
    >
      {children}
    </button>
  );
}

export function SettingsAlert({
  tone,
  message,
}: {
  tone: "error" | "success";
  message: string;
}) {
  return (
    <p
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-red-400/20 bg-red-400/[0.06] text-red-200"
          : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200",
      )}
    >
      {message}
    </p>
  );
}

export function SettingsFooter({
  loading,
  disabled,
  cancelHref = "/dashboard",
  submitLabel = "Save changes",
}: {
  loading: boolean;
  disabled?: boolean;
  cancelHref?: string;
  submitLabel?: string;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-10 border-t border-white/[0.06] bg-[var(--background)]/85 px-4 py-4 backdrop-blur-xl sm:-mx-0 sm:rounded-2xl sm:border sm:px-5 lg:-mx-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={cancelHref}
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
        >
          Discard changes
        </Link>
        <button
          type="submit"
          disabled={loading || disabled}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  );
}

export function SettingsNav({
  showPlayer,
  showTeam,
}: {
  showPlayer: boolean;
  showTeam: boolean;
}) {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard/settings/account", label: "Account", icon: Settings },
    ...(showPlayer
      ? [{ href: "/dashboard/settings/profile", label: "Player", icon: UserRound }]
      : []),
    ...(showTeam
      ? [{ href: "/dashboard/settings/team", label: "Team", icon: Building2 }]
      : []),
  ];

  if (tabs.length <= 1) return null;

  return (
    <nav className="mb-8 flex gap-1 rounded-2xl border border-white/[0.06] bg-[var(--surface)]/60 p-1.5">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-white/[0.06] text-white ring-1 ring-inset ring-white/10"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <tab.icon className={cn("h-4 w-4", active ? "text-cyan-400" : "")} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SettingsHero({
  eyebrow,
  title,
  description,
  preview,
}: {
  eyebrow: string;
  title: string;
  description: string;
  preview?: React.ReactNode;
}) {
  return (
    <header className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-cyan-400/[0.06] via-[var(--surface)] to-violet-500/[0.05]">
      <div className="bg-grid bg-grid-fade absolute inset-0 opacity-30" aria-hidden />
      <div className="relative p-6 sm:p-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400/90">
          {eyebrow}
        </p>
        <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-400">{description}</p>
        {preview && <div className="mt-6">{preview}</div>}
      </div>
    </header>
  );
}

export function ProfilePreview({
  handle,
  game,
  rank,
  region,
}: {
  handle: string;
  game: string;
  rank: string;
  region: string;
}) {
  const initial = handle.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3 backdrop-blur-sm">
      <span className="font-heading flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-zinc-950">
        {initial}
      </span>
      <div>
        <p className="font-heading text-base font-semibold text-white">
          {handle || "Your handle"}
        </p>
        <p className="text-xs text-zinc-500">
          {[game, rank, region].filter(Boolean).join(" · ") || "Competitive details"}
        </p>
      </div>
    </div>
  );
}
