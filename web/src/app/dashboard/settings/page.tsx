import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Settings, UserRound } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { canEditTeam } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function SettingsIndexPage() {
  const ctx = await getDashboardContext();
  const hasProfile = !!ctx.playerProfile;
  const hasTeamEdit = !!ctx.team && canEditTeam(ctx.membershipRole);

  if (hasProfile && !hasTeamEdit) {
    redirect("/dashboard/settings/profile");
  }

  if (!hasProfile && hasTeamEdit) {
    redirect("/dashboard/settings/team");
  }

  if (!hasProfile && !hasTeamEdit) {
    redirect("/dashboard/settings/account");
  }

  const options = [
    {
      href: "/dashboard/settings/account",
      title: "User account",
      description: "Email, display name, sign-in, role, and permissions.",
      icon: Settings,
    },
    ...(hasProfile
      ? [
          {
            href: "/dashboard/settings/profile",
            title: "Player profile",
            description: "Handle, competitive info, play time, and scout card.",
            icon: UserRound,
          },
        ]
      : []),
    ...(hasTeamEdit
      ? [
          {
            href: "/dashboard/settings/team",
            title: "Team profile",
            description: "Org name, titles, region, and sponsorship signals.",
            icon: Building2,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-30" aria-hidden />
        <div className="relative">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Settings
          </p>
          <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Settings
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--foreground-muted)]">
            Your user account is separate from player and team profiles — pick what
            you need to view or update.
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((opt) => (
          <Link
            key={opt.href}
            href={opt.href}
            className="group relative overflow-hidden rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--background)]"
          >
            <span className="oc-mark">
              <opt.icon className="h-5 w-5" />
            </span>
            <h2 className="font-heading mt-5 text-lg font-semibold text-[var(--foreground)]">
              {opt.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              {opt.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--foreground-muted)] transition-colors group-hover:text-[var(--accent)]">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
