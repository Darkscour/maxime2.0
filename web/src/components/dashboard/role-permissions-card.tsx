import { Badge } from "@/components/ui/badge";
import { canEditTeam } from "@/lib/permissions";
import { isVerifiedManager } from "@/lib/manager-verification";
import { Check, Shield, X } from "lucide-react";

type PermissionRow = {
  label: string;
  allowed: boolean;
};

function buildPermissions(input: {
  accountType: string | null;
  membershipRole: string | null;
  managerVerificationStatus: string | null;
}): PermissionRow[] {
  const isManager = input.accountType === "team_manager";
  const isPlayer = input.accountType === "player";
  const canEdit = canEditTeam(input.membershipRole);
  const verified = isVerifiedManager(input.managerVerificationStatus);

  if (isManager) {
    return [
      { label: "Create & edit team profile", allowed: canEdit },
      { label: "Invite players to roster", allowed: canEdit && verified },
      { label: "Manage sponsorship pipeline", allowed: canEdit && verified },
      { label: "Edit player profiles", allowed: false },
    ];
  }

  if (isPlayer) {
    return [
      { label: "Edit your player profile", allowed: true },
      { label: "Join a team with invite code", allowed: true },
      { label: "Edit team org profile", allowed: false },
      { label: "Manage sponsorship pipeline", allowed: !!input.membershipRole },
    ];
  }

  return [
    { label: "Complete onboarding to unlock permissions", allowed: false },
  ];
}

export function RolePermissionsCard({
  accountType,
  membershipRole,
  managerTitle,
  managerVerificationStatus,
  embedded = false,
}: {
  accountType: string | null;
  membershipRole: string | null;
  managerTitle: string | null;
  managerVerificationStatus: string | null;
  /** Flat layout for settings pages — no standalone card chrome. */
  embedded?: boolean;
}) {
  const permissions = buildPermissions({
    accountType,
    membershipRole,
    managerVerificationStatus,
  });

  const verified = isVerifiedManager(managerVerificationStatus);
  const isManager = accountType === "team_manager";

  const content = (
    <>
      {!embedded && (
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 ring-1 ring-inset ring-violet-400/25">
            <Shield className="h-5 w-5 text-violet-300" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Role & permissions
            </p>
            <h2 className="font-heading mt-1 text-lg font-semibold text-white">
              {accountType === "team_manager"
                ? "Team manager"
                : accountType === "player"
                  ? "Player"
                  : "Account"}
            </h2>
            {managerTitle && (
              <p className="mt-0.5 text-sm text-zinc-400">{managerTitle}</p>
            )}
          </div>
        </div>
      )}

      {embedded && managerTitle && (
        <p className="text-sm text-zinc-400">{managerTitle}</p>
      )}

      <div className={embedded ? "mt-3 flex flex-wrap gap-2" : "mt-4 flex flex-wrap gap-2"}>
        {membershipRole && (
          <Badge tone="cyan" className="capitalize">
            {membershipRole}
          </Badge>
        )}
        {isManager && (
          <Badge tone={verified ? "green" : "amber"}>
            {verified ? "Verified manager" : "Verification pending"}
          </Badge>
        )}
      </div>

      <ul className="mt-5 space-y-2.5">
        {permissions.map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-2.5 text-sm text-zinc-300"
          >
            {row.allowed ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <X className="h-4 w-4 shrink-0 text-zinc-600" />
            )}
            <span className={row.allowed ? "text-zinc-200" : "text-zinc-500"}>
              {row.label}
            </span>
          </li>
        ))}
      </ul>

      {isManager && !verified && (
        <p className="mt-4 text-xs leading-5 text-amber-200/80">
          Use your official school or org email during team setup to verify manager
          access. Pending managers can edit their team profile; sponsorship tools
          unlock after verification.
        </p>
      )}
    </>
  );

  if (embedded) return content;

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6">
      {content}
    </div>
  );
}
