export const AUTH_INTENT_COOKIE = "maxime_auth_intent";

export type AuthIntent = "sign-in" | "sign-up";

export function parseAuthIntent(value: string | undefined | null): AuthIntent {
  return value === "sign-up" ? "sign-up" : "sign-in";
}

/** Cookie value only — returns null when the intent cookie is absent. */
export function parseSessionAuthIntent(
  value: string | undefined | null,
): AuthIntent | null {
  if (value == null || value === "") return null;
  return parseAuthIntent(value);
}

/** Query flag on /auth/continue for explicit Maxime sign-up (skips intermediate screens). */
export const MAXIME_SIGNUP_CONFIRM_PARAM = "maxime_signup";

export function hasMaximeSignupConfirm(
  searchParams:
    | URLSearchParams
    | { [key: string]: string | string[] | undefined },
): boolean {
  const value =
    searchParams instanceof URLSearchParams
      ? searchParams.get(MAXIME_SIGNUP_CONFIRM_PARAM)
      : searchParams[MAXIME_SIGNUP_CONFIRM_PARAM];
  return value === "1" || value?.[0] === "1";
}

/**
 * Decide whether the user is signing in or signing up.
 *
 * Genuine Maxime sign-ups ALWAYS arrive with an explicit confirm param (added by
 * our own sign-up UI / redirects) or a "sign-up" session cookie. Clerk, however,
 * redirects first-time OAuth users to a bare `intent=sign-up` URL (its
 * signUpForceRedirectUrl) even when they clicked "Sign in" with a new email.
 * Those unconfirmed sign-up URLs must be treated as sign-in so unregistered users
 * land on the "No Maxime account yet" screen instead of silently registering.
 */
export function resolveEffectiveAuthIntent(
  urlIntent: AuthIntent,
  sessionIntent: AuthIntent | null | undefined,
  explicitSignupConfirm?: boolean,
): AuthIntent {
  if (explicitSignupConfirm) return "sign-up";
  // Sign-in URLs always mean sign-in — never let a stale sign-up cookie auto-register.
  if (urlIntent === "sign-in") return "sign-in";
  if (urlIntent === "sign-up" && sessionIntent === "sign-up") return "sign-up";
  return "sign-in";
}

/** Post-auth router URL that starts Maxime registration (creates platform row). */
export function authContinueSignupPath(): string {
  return `/auth/continue?intent=sign-up&${MAXIME_SIGNUP_CONFIRM_PARAM}=1`;
}

/**
 * Signed-in users without a finished Maxime profile — sign-up continues to
 * onboarding; sign-in alone sees the no-account page.
 */
export function pathForUnregisteredSession(options: {
  sessionIntent: AuthIntent | null;
  signupPending?: boolean;
  hasPlatformShell?: boolean;
}): string {
  const signingUp =
    options.signupPending ||
    options.sessionIntent === "sign-up";

  if (options.hasPlatformShell && signingUp) {
    return appendMaximeSignupPending("/onboarding");
  }
  if (signingUp) {
    return authContinueSignupPath();
  }
  return "/auth/no-maxime-account";
}

export function authContinuePath(intent: AuthIntent): string {
  if (intent === "sign-up") return authContinueSignupPath();
  return `/auth/continue?intent=${intent}`;
}

/** Lets signed-in users view /sign-in or /sign-up without auto-redirecting to /auth/continue. */
export const AUTH_PAGE_ALLOW_PARAM = "allow";

export function authPageAllowHref(path: "/sign-in" | "/sign-up"): string {
  return `${path}?${AUTH_PAGE_ALLOW_PARAM}=1`;
}

export function hasAuthPageAllow(searchParams: {
  [key: string]: string | string[] | undefined;
}): boolean {
  const value = searchParams[AUTH_PAGE_ALLOW_PARAM];
  return value === "1" || value?.[0] === "1";
}

export const authIntentCookieOptions = {
  path: "/",
  maxAge: 60 * 30,
  sameSite: "lax" as const,
};

/** Query flag on /onboarding after explicit Maxime sign-up (empty shells allowed). */
export const MAXIME_SIGNUP_PENDING_PARAM = "signup";

export function hasMaximeSignupPending(searchParams: URLSearchParams): boolean {
  return searchParams.get(MAXIME_SIGNUP_PENDING_PARAM) === "1";
}

export function appendMaximeSignupPending(path: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${MAXIME_SIGNUP_PENDING_PARAM}=1`;
}

/** Read auth intent from document.cookie (client components only). */
export function readAuthIntentCookie(): AuthIntent | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${AUTH_INTENT_COOKIE}=([^;]*)`),
  );
  if (!match?.[1]) return null;

  return parseAuthIntent(decodeURIComponent(match[1]));
}
