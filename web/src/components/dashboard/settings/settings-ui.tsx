"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Building2, Settings, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  navGroupAccentEyebrowClasses,
  type NavGroupAccent,
} from "@/lib/dashboard-nav";
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
      <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
      {hint && (
        <span className="mt-0.5 block text-xs leading-5 text-[var(--foreground-muted)]">
          {hint}
        </span>
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
      className="scroll-mt-8 overflow-hidden rounded-none border border-[var(--foreground)] bg-[var(--surface)]"
    >
      <div className="flex items-start gap-4 border-b border-[var(--border)] bg-[var(--background)] px-5 py-4 sm:px-6">
        <span className="oc-mark">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-heading text-base font-semibold text-[var(--foreground)]">
            {title}
          </h2>
          <p className="mt-0.5 text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
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
        "rounded-none px-3.5 py-2 text-xs font-medium transition-colors",
        active
          ? "border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"
          : "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground-muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]",
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
        "rounded-none border px-4 py-3 text-sm",
        tone === "error"
          ? "border-[color-mix(in_srgb,var(--danger)_35%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] text-[var(--danger)]"
          : "border-[color-mix(in_srgb,var(--success)_35%,var(--border))] bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-[var(--success)]",
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
    <div className="sticky bottom-0 z-10 -mx-4 mt-10 border-t border-[var(--border)] bg-[var(--background)]/90 px-4 py-4 backdrop-blur-xl sm:-mx-0 sm:rounded-none sm:border sm:border-[var(--foreground)] sm:px-5 lg:-mx-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={cancelHref}
          className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          Discard changes
        </Link>
        <button
          type="submit"
          disabled={loading || disabled}
          className="inline-flex items-center justify-center rounded-none bg-[var(--foreground)] px-6 py-2.5 text-sm font-semibold text-[var(--background)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] disabled:cursor-not-allowed disabled:opacity-40"
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
    <nav className="mb-8 flex gap-1 rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-1.5">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-none px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]",
            )}
          >
            <tab.icon
              className={cn("h-4 w-4", active ? "text-[var(--accent)]" : "")}
            />
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
  accent = "cyan",
}: {
  eyebrow: string;
  title: string;
  description: string;
  preview?: React.ReactNode;
  accent?: NavGroupAccent;
}) {
  return (
    <header className="relative mb-8 overflow-hidden rounded-none border border-[var(--foreground)] bg-[var(--surface)]">
      <div className="bg-grid bg-grid-fade absolute inset-0 opacity-30" aria-hidden />
      <div className="relative p-6 sm:p-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <p
          className={cn(
            "mt-5 text-xs font-semibold uppercase tracking-[0.22em]",
            navGroupAccentEyebrowClasses[accent],
          )}
        >
          {eyebrow}
        </p>
        <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--foreground-muted)]">
          {description}
        </p>
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
    <div className="inline-flex items-center gap-3 rounded-none border border-[var(--border)] bg-[var(--background)] px-4 py-3">
      <span className="font-heading flex h-11 w-11 items-center justify-center rounded-none bg-[var(--foreground)] text-lg font-bold text-[var(--background)]">
        {initial}
      </span>
      <div>
        <p className="font-heading text-base font-semibold text-[var(--foreground)]">
          {handle || "Your handle"}
        </p>
        <p className="text-xs text-[var(--foreground-muted)]">
          {[game, rank, region].filter(Boolean).join(" · ") || "Competitive details"}
        </p>
      </div>
    </div>
  );
}
