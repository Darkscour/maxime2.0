import Link from "next/link";
import { GraduationCap, Globe2 } from "lucide-react";
import type { AccountTier } from "@/lib/account-tier";
import { getTierDescription } from "@/lib/account-tier";
import { OnboardingBackNav } from "@/components/onboarding/onboarding-back-nav";
import { StepHeader } from "@/components/onboarding/form-fields";

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
          tone="cyan"
        />
        <TierCard
          href={collegiateHref}
          icon={GraduationCap}
          tier="collegiate"
          role={role}
          tone="violet"
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
  tone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tier: AccountTier;
  role: "team_manager" | "player";
  tone: "cyan" | "violet";
}) {
  const { title, description } = getTierDescription(tier, role);
  const ring =
    tone === "cyan"
      ? "hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
      : "hover:border-violet-400/30 hover:bg-violet-400/[0.04]";
  const iconColor = tone === "cyan" ? "text-cyan-400" : "text-violet-400";

  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-6 transition-colors ${ring}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </span>
      <h2 className="font-heading mt-4 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{description}</p>
      <span className="mt-4 text-sm font-medium text-zinc-300 group-hover:text-white">
        Continue →
      </span>
    </Link>
  );
}
