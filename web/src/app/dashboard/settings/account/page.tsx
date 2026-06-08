import { Calendar, Mail, Shield, UserRound } from "lucide-react";
import { getAccountSettings } from "@/lib/auth-user";
import { SettingsHero } from "@/components/dashboard/settings/settings-ui";
import { ManageAccountButton } from "@/components/dashboard/settings/manage-account-button";
import { RolePermissionsCard } from "@/components/dashboard/role-permissions-card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function accountTypeLabel(accountType: string | null) {
  if (accountType === "team_manager") return "Team manager";
  if (accountType === "player") return "Player";
  return "Not set";
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-inset ring-white/10">
        <Icon className="h-4 w-4 text-cyan-400" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
        <div className="mt-1 text-sm text-white">{value}</div>
      </div>
    </div>
  );
}

export default async function AccountSettingsPage() {
  const account = await getAccountSettings();
  const displayName =
    account.displayName || account.clerkUsername || "Your account";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="space-y-8">
      <SettingsHero
        eyebrow="Account"
        title="User settings"
        description="Your sign-in identity on Maxime. Team and player profiles are managed separately under Team Profile."
        preview={
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3 backdrop-blur-sm">
            {account.clerkImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={account.clerkImageUrl}
                alt=""
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-inset ring-white/10"
              />
            ) : (
              <span className="font-heading flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-zinc-950">
                {initial}
              </span>
            )}
            <div>
              <p className="font-heading text-base font-semibold text-white">{displayName}</p>
              <p className="text-xs text-zinc-500">{account.email ?? "No email on file"}</p>
            </div>
          </div>
        }
      />

      <section className="space-y-3">
        <InfoRow
          label="Email"
          icon={Mail}
          value={account.email ?? <span className="text-zinc-500">Not available</span>}
        />
        <InfoRow
          label="Display name"
          icon={UserRound}
          value={account.displayName ?? <span className="text-zinc-500">Not set</span>}
        />
        <InfoRow
          label="Account type"
          icon={Shield}
          value={
            <span className="inline-flex items-center gap-2">
              {accountTypeLabel(account.accountType)}
              {account.onboardingComplete && (
                <Badge tone="green" className="text-[10px]">
                  Onboarded
                </Badge>
              )}
            </span>
          }
        />
        <InfoRow
          label="Joined Maxime"
          icon={Calendar}
          value={formatDate(account.joinedAt)}
        />
      </section>

      {account.onboardingComplete && (
        <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface)]/90 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 ring-1 ring-inset ring-violet-400/25">
              <Shield className="h-4 w-4 text-violet-300" />
            </span>
            <div>
              <h2 className="font-heading text-base font-semibold text-white">
                Role & permissions
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                What your account can do on Maxime based on your role and verification
                status.
              </p>
            </div>
          </div>
          <div className="mt-5 border-t border-white/5 pt-5">
            <RolePermissionsCard
              embedded
              accountType={account.accountType}
              membershipRole={account.membershipRole}
              managerTitle={account.managerTitle}
              managerVerificationStatus={account.managerVerificationStatus}
            />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface)]/90 p-5 sm:p-6">
        <h2 className="font-heading text-base font-semibold text-white">Sign-in & security</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500">
          Password, connected accounts, and verification are managed through Clerk. Use the
          button below to update your credentials.
        </p>
        <div className="mt-4">
          <ManageAccountButton />
        </div>
      </div>
    </div>
  );
}
