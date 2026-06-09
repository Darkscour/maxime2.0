import { getAccountSettings } from "@/lib/auth-user";
import { SettingsHero } from "@/components/dashboard/settings/settings-ui";
import { AccountSettingsForm } from "@/components/dashboard/settings/account-settings-form";
import { RolePermissionsCard } from "@/components/dashboard/role-permissions-card";
import { ManageAccountButton } from "@/components/dashboard/settings/manage-account-button";
import { Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const account = await getAccountSettings();
  const displayName =
    account.displayName || account.clerkUsername || "Your account";

  return (
    <div className="space-y-8">
      <SettingsHero
        eyebrow="Account"
        title="User settings"
        description="Your sign-in identity on Maxime. Team and player profiles are managed separately."
      />

      <AccountSettingsForm
        initialDisplayName={displayName}
        initialEmail={account.email}
      />

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
          Password, two-factor auth, and connected accounts are managed through Clerk.
        </p>
        <div className="mt-4">
          <ManageAccountButton />
        </div>
      </div>
    </div>
  );
}
