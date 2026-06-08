import { getOrCreateUserAccount } from "@/lib/auth-user";
import { deriveOnboardingComplete } from "@/lib/onboarding-complete";

export const TEAM_EDIT_ROLES = ["captain", "manager"] as const;

export function canEditTeam(role: string | null | undefined): boolean {
  return role === "captain" || role === "manager";
}

export function canUseTeamPipeline(role: string | null | undefined): boolean {
  return !!role;
}

export function canInvitePlayers(
  role: string | null | undefined,
  managerVerificationStatus: string | null | undefined,
): boolean {
  return (
    canEditTeam(role) && managerVerificationStatus === "verified"
  );
}

export async function requireOnboardingComplete() {
  const account = await getOrCreateUserAccount();
  if (!deriveOnboardingComplete(account)) {
    throw new Error("ONBOARDING_INCOMPLETE");
  }
  return account;
}

export async function requireTeamMembership() {
  const account = await requireOnboardingComplete();
  if (!account.membership) {
    throw new Error("NO_TEAM");
  }
  return {
    account,
    teamId: account.membership.teamId,
    role: account.membership.role,
    team: account.membership.team,
  };
}

export async function requireCaptainOrManager() {
  const ctx = await requireTeamMembership();
  if (!canEditTeam(ctx.role)) {
    throw new Error("FORBIDDEN_TEAM_EDIT");
  }
  return ctx;
}

export async function requirePlayerProfile() {
  const account = await requireOnboardingComplete();
  const { playerProfile } = account;
  if (!playerProfile) {
    throw new Error("NO_PLAYER_PROFILE");
  }
  return { ...account, playerProfile };
}

export function permissionErrorResponse(e: unknown) {
  if (!(e instanceof Error)) {
    return { status: 500, body: { error: "Something went wrong." } };
  }

  switch (e.message) {
    case "UNAUTHORIZED":
      return { status: 401, body: { error: "Sign in required." } };
    case "ONBOARDING_INCOMPLETE":
      return { status: 403, body: { error: "Complete onboarding before using this feature." } };
    case "NO_TEAM":
      return { status: 403, body: { error: "Join or create a team first." } };
    case "FORBIDDEN_TEAM_EDIT":
      return {
        status: 403,
        body: { error: "Only captains and managers can edit team info." },
      };
    case "NO_PLAYER_PROFILE":
      return { status: 400, body: { error: "Create a player profile first." } };
    default:
      return { status: 500, body: { error: "Something went wrong." } };
  }
}
