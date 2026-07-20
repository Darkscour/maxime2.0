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
        accent="muted"
        title="User settings"
        description="Your sign-in identity on Maxime. Team and player profiles are managed separately."
      />

      <AccountSettingsForm
        initialDisplayName={displayName}
        initialEmail={account.email}
      />

      {account.onboardingComplete && (
        <div className="desk-panel p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="oc-mark">
              <Shield className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-heading text-base font-semibold text-[var(--foreground)]">
                Role & permissions
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                What your account can do on Maxime based on your role and verification
                status.
              </p>
            </div>
          </div>
          <div className="mt-5 border-t border-[var(--border)] pt-5">
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

      <div className="desk-panel p-5 sm:p-6">
        <h2 className="font-heading text-base font-semibold text-[var(--foreground)]">Sign-in & security</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
          Password, two-factor auth, and connected accounts are managed through Clerk.
        </p>
        <div className="mt-4">
          <ManageAccountButton />
        </div>
      </div>
    </div>
  );
}
