export const MANAGER_TITLES = [
  "Team Captain",
  "Head Coach",
  "Assistant Coach",
  "Team Manager",
  "President / Director",
  "Operations Lead",
] as const;

export type ManagerVerificationStatus = "verified" | "pending";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function domainFromEmail(email: string) {
  const at = email.lastIndexOf("@");
  return at === -1 ? "" : email.slice(at + 1);
}

function schoolTokens(school: string) {
  return school
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 3);
}

/** Heuristic check: institutional email or domain aligned with school name. */
export function evaluateManagerVerification(input: {
  orgEmail: string;
  school?: string | null;
  signInEmail?: string | null;
}): { status: ManagerVerificationStatus; reason: string } {
  const orgEmail = normalizeEmail(input.orgEmail);
  const domain = domainFromEmail(orgEmail);

  if (!orgEmail || !domain.includes(".")) {
    return { status: "pending", reason: "Provide a valid organization email." };
  }

  if (domain.endsWith(".edu")) {
    return { status: "verified", reason: "Verified via institutional .edu email." };
  }

  if (input.signInEmail && normalizeEmail(input.signInEmail) === orgEmail) {
    return {
      status: "verified",
      reason: "Verified — org email matches your sign-in email.",
    };
  }

  if (input.school) {
    const tokens = schoolTokens(input.school);
    if (tokens.some((token) => domain.includes(token))) {
      return {
        status: "verified",
        reason: "Verified — org email domain matches your school.",
      };
    }
  }

  return {
    status: "pending",
    reason: "Pending review — use a school or org email to verify faster.",
  };
}

export function isVerifiedManager(
  status: string | null | undefined,
): boolean {
  return status === "verified";
}
