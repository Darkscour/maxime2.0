import { domainFromEmail, normalizeEmail } from "@/lib/manager-verification";

export type InstitutionEmailTarget = {
  name: string;
  primaryDomain: string | null;
  domains?: string[];
};

export function toInstitutionEmailTarget(
  institution: InstitutionEmailTarget,
): Required<InstitutionEmailTarget> {
  return {
    name: institution.name,
    primaryDomain: institution.primaryDomain,
    domains: institution.domains ?? [],
  };
}

export function collectInstitutionDomains(
  institution: InstitutionEmailTarget,
): string[] {
  const set = new Set<string>();
  const normalized = toInstitutionEmailTarget(institution);

  for (const raw of [normalized.primaryDomain, ...normalized.domains]) {
    if (!raw) continue;
    const domain = raw.trim().toLowerCase().replace(/^www\./, "");
    if (domain.includes(".")) set.add(domain);
  }

  return [...set];
}

/** True when the email domain matches the institution's known domains (incl. subdomains). */
export function emailMatchesInstitution(
  email: string,
  institution: InstitutionEmailTarget,
): boolean {
  const emailDomain = domainFromEmail(normalizeEmail(email));
  if (!emailDomain) return false;

  const known = collectInstitutionDomains(institution);
  if (known.length === 0) return false;

  return known.some(
    (d) => emailDomain === d || emailDomain.endsWith(`.${d}`),
  );
}

export type CollegiateEmailVerification = {
  status: "verified" | "pending";
  reason: string;
};

/**
 * Collegiate accounts must use an email on the selected institution's domain list.
 * Falls back to generic .edu when the institution has no domain data yet.
 */
export function evaluateInstitutionEmailVerification(input: {
  email: string;
  institution: InstitutionEmailTarget;
  signInEmail?: string | null;
}): CollegiateEmailVerification {
  const email = normalizeEmail(input.email);
  const domain = domainFromEmail(email);

  if (!email || !domain.includes(".")) {
    return { status: "pending", reason: "Enter a valid email address." };
  }

  const known = collectInstitutionDomains(input.institution);

  if (known.length > 0 && emailMatchesInstitution(email, input.institution)) {
    return {
      status: "verified",
      reason: `Verified — email matches ${input.institution.name}.`,
    };
  }

  if (known.length === 0 && domain.endsWith(".edu")) {
    return {
      status: "verified",
      reason: "Verified via institutional .edu email.",
    };
  }

  if (
    input.signInEmail &&
    normalizeEmail(input.signInEmail) === email &&
    known.length > 0 &&
    emailMatchesInstitution(email, input.institution)
  ) {
    return {
      status: "verified",
      reason: "Verified — email matches your sign-in and institution.",
    };
  }

  const domainHint =
    known.length > 0
      ? ` Use an email ending in @${known[0]} or a recognized university alias.`
      : " Use your official school .edu email.";

  return {
    status: "pending",
    reason: `This email does not match ${input.institution.name}.${domainHint}`,
  };
}
