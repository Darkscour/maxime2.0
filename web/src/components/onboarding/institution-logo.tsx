"use client";

import { useState } from "react";
import { institutionInitials } from "@/lib/logo-dev";
import { cn } from "@/lib/utils";

export function InstitutionLogoWithFallback({
  name,
  logoUrl,
  size = "md",
  className,
}: {
  name: string;
  logoUrl: string | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const text = size === "sm" ? "text-xs" : "text-sm";
  const initials = institutionInitials(name);
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = !!logoUrl && !imageFailed;

  return (
    <span className={cn("relative shrink-0", dim, className)}>
      {!showImage && (
        <span
          className={cn(
            dim,
            text,
            "flex items-center justify-center rounded-lg bg-cyan-400/15 font-semibold text-cyan-200 ring-1 ring-inset ring-cyan-400/25",
          )}
          aria-hidden
        >
          {initials}
        </span>
      )}
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          className={cn(dim, "object-contain", !showImage && "hidden")}
          onError={() => setImageFailed(true)}
        />
      )}
    </span>
  );
}
