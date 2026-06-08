import { getDashboardContext } from "@/lib/auth-user";
import { SettingsChrome } from "@/components/dashboard/settings/settings-chrome";

export const dynamic = "force-dynamic";

function canEditTeam(role: string | null) {
  return role === "captain" || role === "manager";
}

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
