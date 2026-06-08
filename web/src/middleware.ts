import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Clerk middleware — runs on every request before pages render.
 *
 * Right now everything is public (homepage, both portals) so anyone can
 * browse. We only require sign-in for explicitly listed routes below.
 *
 * Later, add gated routes like `/dashboard`, `/team/*`, `/api/shortlists`
 * to `isProtectedRoute` and Clerk will redirect unauthenticated users to
 * /sign-in automatically.
 */

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
  "/auth/continue",
  "/api/onboarding/team",
  "/api/onboarding/player",
  "/api/onboarding/join",
  "/api/player/play-time",
  "/api/sponsorship/leads",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
