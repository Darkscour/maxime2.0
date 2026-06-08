import { getOrCreateUserAccount } from "@/lib/auth-user";

export async function requireTeamMembership() {
  const account = await getOrCreateUserAccount();
  if (!account.membership) {
    throw new Error("NO_TEAM");
  }
  return {
    account,
    teamId: account.membership.teamId,
    role: account.membership.role,
  };
}
