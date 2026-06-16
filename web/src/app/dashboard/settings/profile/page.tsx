import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import {
  PlayerProfileEditForm,
  type PlayerProfileFormData,
} from "@/components/dashboard/player-profile-edit-form";

export const dynamic = "force-dynamic";

function toFormData(
  profile: NonNullable<Awaited<ReturnType<typeof getDashboardContext>>["playerProfile"]>,
): PlayerProfileFormData {
  return {
    handle: profile.handle,
    game: profile.game,
    role: profile.role,
    rank: profile.rank,
    region: profile.region,
    school: profile.school ?? "",
    age: profile.age != null ? String(profile.age) : "",
    hoursPerWeek: profile.hoursPerWeek != null ? String(profile.hoursPerWeek) : "",
    status: profile.status,
    tags: profile.tags.join(", "),
    bio: profile.bio ?? "",
  };
}

import { canEditTeam } from "@/lib/permissions";

export default async function ProfileSettingsPage() {
  const ctx = await getDashboardContext();

  if (!ctx.playerProfile) {
    if (ctx.team && canEditTeam(ctx.membershipRole)) {
      redirect("/dashboard/settings/team");
    }
    redirect("/dashboard");
  }

  return (
    <PlayerProfileEditForm
      initial={toFormData(ctx.playerProfile)}
      showSchoolField={ctx.playerProfile.accountTier === "collegiate"}
    />
  );
}
