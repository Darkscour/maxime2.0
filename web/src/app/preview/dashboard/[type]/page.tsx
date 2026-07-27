import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DeskMantineView,
  type DeskAudience,
} from "@/components/dashboard/desk-mantine";
import { DeskMantinePreviewBanner } from "@/components/dashboard/desk-mantine-preview-banner";
import { DESK_MOCK_BY_AUDIENCE } from "@/lib/desk-mantine-mock";

export const dynamic = "force-static";

const VALID: DeskAudience[] = [
  "manager_collegiate",
  "manager_grassroots",
  "player_collegiate",
  "player_grassroots",
];

function audienceToAccount(audience: DeskAudience): {
  accountType: string;
  accountTier: string;
} {
  const [role, tier] = audience.split("_") as ["manager" | "player", "collegiate" | "grassroots"];
  return {
    accountType: role === "manager" ? "team_manager" : "player",
    accountTier: tier,
  };
}

export function generateStaticParams() {
  return VALID.map((type) => ({ type }));
}

export default async function DashboardPreviewPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!VALID.includes(type as DeskAudience)) notFound();
  const audience = type as DeskAudience;
  const view = DESK_MOCK_BY_AUDIENCE[audience];
  const { accountType, accountTier } = audienceToAccount(audience);

  return (
    <DashboardShell
      accountType={accountType}
      accountTier={accountTier}
      teamName={view.identity.kind === "org" ? view.identity.name : null}
      activeHref="/dashboard"
    >
      <DeskMantinePreviewBanner active={audience} />
      <DeskMantineView {...view} />
    </DashboardShell>
  );
}
