"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Globe2 } from "lucide-react";
import type { AccountTier } from "@/lib/account-tier";
import { getTierDescription } from "@/lib/account-tier";
import { OnboardingBackNav } from "@/components/onboarding/onboarding-back-nav";
import { StepHeader } from "@/components/onboarding/form-fields";
import { recordOnboardingCheckpoint } from "@/lib/onboarding-checkpoint-client";

type AccountTierSelectionProps = {
  role: "team_manager" | "player";
  collegiateHref: string;
  grassrootsHref: string;
  backHref: string;
  backLabel: string;
};

export function AccountTierSelection({
  role,
  collegiateHref,
  grassrootsHref,
  backHref,
  backLabel,
}: AccountTierSelectionProps) {
  const isManager = role === "team_manager";

  return (
    <div>
      <OnboardingBackNav href={backHref} label={backLabel} />
      <StepHeader
        step={isManager ? "Team onboarding" : "Player onboarding"}
        title={
          isManager
            ? "What kind of team are you managing?"
            : "What kind of player account is this?"
        }
        subtitle={
          isManager
            ? "Collegiate orgs recruit on campus. Grassroots teams recruit openly by region."
            : "Collegiate players join their campus talent pool. Grassroots players are visible to open teams by region."
        }
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <TierCard
          href={grassrootsHref}
          icon={Globe2}
          tier="grassroots"
          role={role}
        />
        <TierCard
          href={collegiateHref}
          icon={GraduationCap}
          tier="collegiate"
          role={role}
        />
      </div>
    </div>
  );
}

function TierCard({
  href,
  icon: Icon,
  tier,
  role,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tier: AccountTier;
  role: "team_manager" | "player";
}) {
  const router = useRouter();
  const { title, description } = getTierDescription(tier, role);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await recordOnboardingCheckpoint(href);
    } catch {
      // Continue navigation even if checkpoint sync fails.
    }
    router.push(href);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group flex flex-col border border-[var(--foreground)] bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--background)]"
    >
      <span className="oc-mark">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="font-heading mt-4 text-lg font-medium tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--foreground-muted)]">
        {description}
      </p>
      <span className="mt-4 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
        Continue →
      </span>
    </Link>
  );
}
