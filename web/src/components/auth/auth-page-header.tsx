import { MaximeHomeLogo } from "@/components/brand/maxime-home-logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/** Logo-only header for auth routes — no marketing nav distractions. */
export function AuthPageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <MaximeHomeLogo href="/" />
        <Button
          href="/"
          variant="ghost"
          size="sm"
          className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Button>
      </div>
    </header>
  );
}
