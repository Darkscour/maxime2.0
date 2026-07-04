import type { Appearance } from "@clerk/types";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";
import { authContinueSignupPath } from "@/lib/auth-intent";

/**
 * Clerk OAuth provider availability (Google + Discord only) is configured in the
 * Clerk Dashboard under Configure → User & Authentication → Social connections.
 * Disable email/password sign-up there if sign-up should show only social buttons.
 */

/** Shared Clerk OAuth settings for sign-in and sign-up. */
export const clerkOAuthFlow = "redirect" as const;

/** Always show the Google account picker (avoids silent re-use of the last account). */
export const clerkOidcPrompt = "select_account" as const;

const clerkSharedAuthProps = {
  appearance: clerkAuthAppearance as Appearance,
  oauthFlow: clerkOAuthFlow,
  oidcPrompt: clerkOidcPrompt,
};

const authContinueSignInPath = "/auth/continue?intent=sign-in";

export const clerkSignInPageProps = {
  ...clerkSharedAuthProps,
  path: "/sign-in",
  routing: "path" as const,
  forceRedirectUrl: authContinueSignInPath,
  fallbackRedirectUrl: authContinueSignInPath,
  // Clerk sends new identities here when "Sign in" creates a Clerk user. Must NOT
  // include maxime_signup — that would auto-register on Maxime instead of the
  // no-account screen for deleted / unknown emails.
  signUpForceRedirectUrl: authContinueSignInPath,
  signUpFallbackRedirectUrl: authContinueSignInPath,
};

export const clerkSignUpPageProps = {
  ...clerkSharedAuthProps,
  path: "/sign-up",
  routing: "path" as const,
  forceRedirectUrl: authContinueSignupPath(),
  fallbackRedirectUrl: authContinueSignupPath(),
  signInForceRedirectUrl: "/auth/continue?intent=sign-in",
  signInFallbackRedirectUrl: "/auth/continue?intent=sign-in",
};
