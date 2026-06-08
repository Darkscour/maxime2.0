import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DashboardStatCard,
  FeatureTile,
} from "@/components/dashboard/dashboard-cards";
import { PlayTimeReport } from "@/components/dashboard/play-time-report";
import { TeamOverviewCard } from "@/components/dashboard/team-overview-card";
import { Building2, Handshake, UserRound, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const ctx = await getDashboardContext();
  const firstName = ctx.displayName?.split(" ")[0] ?? "there";
  const isManager = ctx.accountType === "team_manager";

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-cyan-400/[0.08] via-[var(--surface)] to-violet-500/[0.06] p-8 sm:p-10">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Your workspace
          </p>
          <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            {isManager
              ? "Manage sponsorship outreach, scout players, and keep your org profile in one place."
              : "Your player profile is live. Explore sponsorships, get discovered, and stay connected with your team."}
          </p>
          {ctx.email && (
            <p className="mt-2 text-sm text-zinc-500">{ctx.email}</p>
          )}
        </div>
        <Sparkles className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-cyan-400/10" />
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Account"
          value={isManager ? "Team manager" : "Player"}
          hint={ctx.membershipRole ? `Role: ${ctx.membershipRole}` : "Individual account"}
          icon={isManager ? Building2 : UserRound}
        />
        <DashboardStatCard
          label="Team"
          value={ctx.team?.name ?? "No team yet"}
          hint={ctx.team?.school ?? "Join with an invite code anytime"}
          icon={Building2}
        />
        <DashboardStatCard
          label={ctx.playerProfile ? "Your game" : "Titles"}
          value={
            ctx.playerProfile
              ? ctx.playerProfile.game
              : ctx.team?.games.length
                ? String(ctx.team.games.length)
                : "—"
          }
          hint={
            ctx.playerProfile
              ? `${ctx.playerProfile.role} · ${ctx.playerProfile.rank}`
              : ctx.team?.games.length
                ? ctx.team.games.length <= 2
                  ? ctx.team.games.join(", ")
                  : `${ctx.team.games.length} active titles`
                : "Add titles in team settings"
          }
          icon={UserRound}
        />
        <DashboardStatCard
          label={ctx.playerProfile ? "Play time" : "Status"}
          value={
            ctx.playerProfile?.hoursPerWeek != null
              ? `${ctx.playerProfile.hoursPerWeek} hrs/wk`
              : ctx.playerProfile?.status ?? "Active"
          }
          hint={
            ctx.playerProfile
              ? ctx.playerProfile.hoursPerWeek != null
                ? `Self-reported · ${ctx.playerProfile.game}`
                : "Report your hours below"
              : (ctx.team?.region ?? "Region not set")
          }
          icon={ctx.playerProfile ? Clock : Users}
        />
      </section>

      {ctx.playerProfile && (
        <PlayTimeReport
          game={ctx.playerProfile.game}
          hoursPerWeek={ctx.playerProfile.hoursPerWeek}
          updatedAt={ctx.playerProfile.updatedAt.toISOString()}
        />
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        {ctx.team && (
          <TeamOverviewCard team={ctx.team} membershipRole={ctx.membershipRole} />
        )}

        {ctx.playerProfile && (
          <div
            className={
              ctx.team
                ? "rounded-2xl border border-white/5 bg-[var(--surface)] p-6"
                : "rounded-2xl border border-white/5 bg-[var(--surface)] p-6 lg:col-span-2"
            }
          >
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Player profile
            </p>
            <h2 className="font-heading mt-2 text-xl font-semibold text-white">
              {ctx.playerProfile.handle}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {ctx.playerProfile.game} · {ctx.playerProfile.role} ·{" "}
              {ctx.playerProfile.rank}
            </p>
            {ctx.playerProfile.hoursPerWeek != null && (
              <p className="mt-3 text-sm text-zinc-400">
                <Clock className="mr-1.5 inline h-3.5 w-3.5 text-cyan-400" />
                {ctx.playerProfile.hoursPerWeek} hrs/week on {ctx.playerProfile.game}{" "}
                <span className="text-zinc-600">(self-reported)</span>
              </p>
            )}
            {ctx.playerProfile.bio && (
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                {ctx.playerProfile.bio}
              </p>
            )}
            {ctx.playerProfile.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {ctx.playerProfile.tags.map((tag) => (
                  <Badge key={tag} tone="violet">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button href="/recruitment" size="sm" variant="outline">
                View recruitment portal
              </Button>
              {!ctx.team && (
                <Button href="/onboarding/join" size="sm" variant="ghost">
                  Join a team
                </Button>
              )}
            </div>
          </div>
        )}

        {!ctx.team && !ctx.playerProfile && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--surface)]/50 p-6 lg:col-span-2">
            <p className="text-sm text-zinc-400">
              Finish setting up your profile to see more details here.
            </p>
            <Button href="/onboarding" className="mt-4" size="sm">
              Continue onboarding
            </Button>
          </div>
        )}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-white">
              Platform features
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Jump into the tools you set up during onboarding.
            </p>
          </div>
          <Link
            href="/"
            className="hidden text-sm text-zinc-500 hover:text-zinc-300 sm:inline"
          >
            Marketing site →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureTile
            href="/sponsorships"
            title="Sponsorship discovery"
            description="Browse brand partners, filter by fit, and build outreach lists for your org."
            icon={Handshake}
            tone="cyan"
          />
          <FeatureTile
            href="/recruitment"
            title="Player recruitment"
            description="Scout talent, compare profiles, and manage roster fit for your titles."
            icon={Users}
            tone="violet"
          />
          <FeatureTile
            href="/onboarding/done"
            title="Profile & invite codes"
            description="Review what you entered during onboarding and share team invite codes."
            icon={Building2}
            tone="cyan"
          />
        </div>
      </section>
    </div>
  );
}
