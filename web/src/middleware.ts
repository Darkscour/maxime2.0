import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
  "/api/player/profile",
  "/api/team/profile",
  "/api/sponsorship/leads",
  "/api/watchlist(.*)",
  "/api/notifications(.*)",
  "/api/invites(.*)",
  "/api/player/leave-team",
  "/api/team/roster/remove",
  "/api/account/profile",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (
    userId &&
    req.nextUrl.pathname === "/" &&
    req.nextUrl.searchParams.get("browse") !== "1"
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/continue";
    url.search = "intent=sign-in";
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.url);
  requestHeaders.set("x-search", req.nextUrl.search);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
