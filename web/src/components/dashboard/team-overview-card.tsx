import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  MapPin,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canEditTeam } from "@/lib/permissions";
import { isVerifiedManager } from "@/lib/manager-verification";
import { TeamInvitePanel } from "@/components/dashboard/team-invite-panel";

export type TeamOverviewData = {
  id: string;
  name: string;
  school: string | null;
  games: string[];
  region: string | null;
  rosterSize: number | null;
  discordUrl: string | null;
  inviteCode: string;
  createdAt: Date;
  memberCount: number;
};

function formatPlatformDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function rosterDisplay(rosterSize: number | null) {
  if (rosterSize != null && rosterSize > 0) {
    return String(rosterSize);
  }
  return "Not set";
}

export function TeamOverviewCard({
  team,
  membershipRole,
  managerVerificationStatus,
}: {
  team: TeamOverviewData;
  membershipRole: string | null;
  managerVerificationStatus?: string | null;
}) {
  const canManage = canEditTeam(membershipRole);
  const verified = isVerifiedManager(managerVerificationStatus ?? null);
  const titles = team.games.length > 0 ? team.games : ["No titles listed yet"];

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">Your team</p>
          <h2 className="font-heading mt-2 text-2xl font-semibold text-white">
            {team.name}
          </h2>
          {team.school && (
            <p className="mt-1 text-sm text-zinc-400">{team.school}</p>
          )}
        </div>
        {membershipRole && (
          <Badge tone={membershipRole === "captain" ? "cyan" : "violet"} className="capitalize">
            {membershipRole}
          </Badge>
        )}
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricItem
          icon={Calendar}
          label="On Maxime since"
          value={formatPlatformDate(team.createdAt)}
        />
        <MetricItem
          icon={Users}
          label="Roster size"
          value={rosterDisplay(team.rosterSize)}
        />
        {team.region && (
          <MetricItem icon={MapPin} label="Region" value={team.region} />
        )}
      </dl>

      <div className="mt-6 border-t border-white/5 pt-5">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          Competitive titles
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          All games your org competes in — no single primary title.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {titles.map((game) => (
            <Badge
              key={game}
              tone="cyan"
              className={team.games.length === 0 ? "text-zinc-500" : undefined}
            >
              {game}
            </Badge>
          ))}
        </div>
      </div>

      {canManage && <TeamInvitePanel inviteCode={team.inviteCode} />}

      {canManage && !verified && (
        <p className="mt-3 text-xs leading-5 text-amber-200/80">
          Your manager account is pending verification. You can share this invite code,
          but sponsorship tools unlock after verification with an official org email.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
        {team.discordUrl && (
          <Button
            href={team.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            variant="outline"
            className="gap-1.5"
          >
            Discord
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        )}
        {canManage && (
          <Button href="/dashboard/settings/team" size="sm" variant="ghost">
            Edit team profile
          </Button>
        )}
        {!canManage && (
          <Link href="/dashboard/settings/team" className="text-sm text-zinc-500 hover:text-zinc-300">
            View team profile →
          </Link>
        )}
      </div>
    </div>
  );
}

function MetricItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <dt className="text-xs uppercase tracking-wider">{label}</dt>
      </div>
      <dd className="font-heading mt-2 text-sm font-semibold text-zinc-100">{value}</dd>
    </div>
  );
}
