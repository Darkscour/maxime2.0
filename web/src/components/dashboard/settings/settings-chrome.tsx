"use client";

import { usePathname } from "next/navigation";
import { SettingsNav } from "@/components/dashboard/settings/settings-ui";

export function SettingsChrome({
  showPlayer,
  showTeam,
  children,
}: {
  showPlayer: boolean;
  showTeam: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHub = pathname === "/dashboard/settings";

  return (
    <div className="mx-auto max-w-3xl">
      {!isHub && <SettingsNav showPlayer={showPlayer} showTeam={showTeam} />}
      {children}
    </div>
  );
}
