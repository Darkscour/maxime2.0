import { domainFromEmail, normalizeEmail, schoolTokens } from "@/lib/manager-verification";

export type PlayerVerificationStatus = "verified" | "pending";

/**
 * Collegiate players must verify with a school email before their profile is created.
 * Unlike managers, pending status is not accepted — only verified passes.
 */
export function evaluateCollegiatePlayerVerification(input: {
  schoolEmail: string;
  school: string;
  signInEmail?: string | null;
}): { status: PlayerVerificationStatus; reason: string } {
  const schoolEmail = normalizeEmail(input.schoolEmail);
  const domain = domainFromEmail(schoolEmail);

  if (!schoolEmail || !domain.includes(".")) {
    return {
      status: "pending",
      reason: "Enter a valid school email address.",
    };
  }

  if (domain.endsWith(".edu")) {
    return {
      status: "verified",
      reason: "Verified via institutional .edu email.",
    };
  }

  const school = input.school.trim();
  if (school.length >= 2) {
    const tokens = schoolTokens(school);
    if (tokens.some((token) => domain.includes(token))) {
      return {
        status: "verified",
        reason: "Verified — school email domain matches your university.",
      };
    }
  }

  if (input.signInEmail && normalizeEmail(input.signInEmail) === schoolEmail) {
    return {
      status: "verified",
      reason: "Verified — school email matches your sign-in email.",
    };
  }

  return {
    status: "pending",
    reason:
      "Use your official school email (e.g. you@school.edu or your university alias) to join as a collegiate player.",
  };
}

export function isVerifiedCollegiatePlayer(
  status: string | null | undefined,
): boolean {
  return status === "verified";
}
