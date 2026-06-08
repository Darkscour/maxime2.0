import { getDashboardContext } from "@/lib/auth-user";
import { SettingsChrome } from "@/components/dashboard/settings/settings-chrome";
import { canEditTeam } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getDashboardContext();

  return (
    <SettingsChrome
      showPlayer={!!ctx.playerProfile}
      showTeam={!!ctx.team && canEditTeam(ctx.membershipRole)}
    >
      {children}
    </SettingsChrome>
  );
}
