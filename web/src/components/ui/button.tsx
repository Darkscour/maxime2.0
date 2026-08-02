import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-none transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_50%,transparent)] " +
  "disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap " +
  "tracking-[-0.01em]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--btn-primary-bg,var(--foreground))] text-[var(--btn-primary-fg,var(--background))] " +
    "hover:bg-[var(--btn-primary-hover-bg,var(--accent))] hover:text-[var(--btn-primary-hover-fg,var(--accent-ink))]",
  secondary:
    "bg-[var(--surface-2)] text-[var(--foreground)] hover:bg-[var(--border)] border border-[var(--border)]",
  ghost:
    "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]",
  outline:
    "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)] hover:bg-[var(--surface)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, target, rel, prefetch } = props;
    return (
      <Link href={href} target={target} rel={rel} prefetch={prefetch} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _ch;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
