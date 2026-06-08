import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Settings, UserRound } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { cn } from "@/lib/utils";
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
      tone: "emerald" as const,
    },
    ...(hasProfile
      ? [
          {
            href: "/dashboard/settings/profile",
            title: "Player profile",
            description: "Handle, competitive info, play time, and scout card.",
            icon: UserRound,
            tone: "cyan" as const,
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
            tone: "violet" as const,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-cyan-400/[0.06] via-[var(--surface)] to-violet-500/[0.05] p-6 sm:p-8">
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-30" aria-hidden />
        <div className="relative">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400/90">
            Settings
          </p>
          <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Settings
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-7 text-zinc-400">
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
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface)]/90 p-6 transition-all",
              opt.tone === "cyan"
                ? "hover:border-cyan-400/25 hover:shadow-[0_0_40px_rgba(34,211,238,0.06)]"
                : opt.tone === "emerald"
                  ? "hover:border-emerald-400/25 hover:shadow-[0_0_40px_rgba(52,211,153,0.06)]"
                  : "hover:border-violet-400/25 hover:shadow-[0_0_40px_rgba(167,139,250,0.06)]",
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset ring-white/10",
                opt.tone === "cyan"
                  ? "bg-cyan-400/10 text-cyan-400"
                  : opt.tone === "emerald"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-violet-400/10 text-violet-400",
              )}
            >
              <opt.icon className="h-5 w-5" />
            </span>
            <h2 className="font-heading mt-5 text-lg font-semibold text-white">
              {opt.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{opt.description}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
