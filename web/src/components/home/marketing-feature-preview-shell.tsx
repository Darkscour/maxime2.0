"use client";

import { Sparkles } from "lucide-react";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";
import { Badge } from "@/components/ui/badge";
import type { NavGroupAccent } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

export function MarketingFeaturePreviewShell({
  eyebrow,
  eyebrowAccent = "cyan",
  title,
  description,
  previewLabel = "Interactive preview",
  previewNote,
  children,
  className,
}: {
  eyebrow: string;
  eyebrowAccent?: NavGroupAccent;
  title: string;
  description: string;
  previewLabel?: string;
  previewNote?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-8", className)}>
      <header className="max-w-3xl">
        <DashboardSectionEyebrow accent={eyebrowAccent}>
          {eyebrow}
        </DashboardSectionEyebrow>
        <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">
          {description}
        </p>
        {previewNote ? (
          <div className="mt-4">
            <Badge tone="amber">
              <Sparkles className="h-3.5 w-3.5" />
              {previewNote}
            </Badge>
          </div>
        ) : null}
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
          {previewLabel}
        </p>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
