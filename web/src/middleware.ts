import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse, type NextRequest } from "next/server";

import {

  AUTH_INTENT_COOKIE,

  authIntentCookieOptions,

  AUTH_PAGE_ALLOW_PARAM,

  MAXIME_SIGNUP_CONFIRM_PARAM,

  type AuthIntent,

} from "@/lib/auth-intent";



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
  "/auth/no-maxime-account",

  "/api/onboarding/team",

  "/api/onboarding/player",

  "/api/onboarding/join",

  "/api/onboarding/checkpoint",

  "/api/player/play-time",

  "/api/player/profile",

  "/api/team/profile",

  "/api/sponsorship/leads",

  "/api/watchlist(.*)",

  "/api/notifications(.*)",

  "/api/invites(.*)",

  "/api/player/leave-team",

  "/api/team/roster/remove",

  "/api/teams/join-request",

  "/api/teams/join-requests",

  "/api/account/profile",

  "/api/dashboard(.*)",

]);



function isClerkOAuthCallback(pathname: string) {

  return (

    pathname.includes("sso-callback") ||

    pathname.includes("_clerk_catchall_check_")

  );

}



function withRequestHeaders(req: NextRequest) {

  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-url", req.url);

  requestHeaders.set("x-search", req.nextUrl.search);

  return requestHeaders;

}



function setAuthIntentCookie(response: NextResponse, intent: AuthIntent) {

  response.cookies.set(AUTH_INTENT_COOKIE, intent, authIntentCookieOptions);

}



function clearAuthIntentCookie(response: NextResponse) {

  response.cookies.delete(AUTH_INTENT_COOKIE);

}



function authContinueRedirect(req: NextRequest, intent: AuthIntent) {

  const url = req.nextUrl.clone();

  url.pathname = "/auth/continue";

  if (intent === "sign-up") {
    url.search = `intent=sign-up&${MAXIME_SIGNUP_CONFIRM_PARAM}=1`;
  } else {
    url.search = "intent=sign-in";
  }

  const response = NextResponse.redirect(url);

  clearAuthIntentCookie(response);

  return response;

}



export default clerkMiddleware(async (auth, req) => {

  const { userId } = await auth();

  const pathname = req.nextUrl.pathname;

  const isOAuthCallback = isClerkOAuthCallback(pathname);

  if (isOAuthCallback) {
    const response = NextResponse.next({
      request: { headers: withRequestHeaders(req) },
    });
    if (pathname.startsWith("/sign-up")) {
      setAuthIntentCookie(response, "sign-up");
    } else if (pathname.startsWith("/sign-in")) {
      setAuthIntentCookie(response, "sign-in");
    }
    return response;
  }

  if (userId && !isOAuthCallback) {

    if (
      pathname === "/sign-up" &&
      req.nextUrl.searchParams.get(AUTH_PAGE_ALLOW_PARAM) === "1"
    ) {
      const response = NextResponse.next({
        request: { headers: withRequestHeaders(req) },
      });
      setAuthIntentCookie(response, "sign-up");
      return response;
    }

    if (
      pathname === "/sign-up" &&
      req.nextUrl.searchParams.get(AUTH_PAGE_ALLOW_PARAM) !== "1"
    ) {
      return authContinueRedirect(req, "sign-in");
    }

    if (
      pathname === "/sign-in" &&
      req.nextUrl.searchParams.get(AUTH_PAGE_ALLOW_PARAM) !== "1"
    ) {
      return authContinueRedirect(req, "sign-in");
    }

    if (pathname === "/auth/continue") {

      if (!req.nextUrl.searchParams.get("intent")) {
        return authContinueRedirect(req, "sign-in");
      }

      return NextResponse.next({

        request: { headers: withRequestHeaders(req) },

      });

    }

  }



  if (!userId && !isOAuthCallback) {

    if (pathname === "/sign-up") {

      const response = NextResponse.next({

        request: { headers: withRequestHeaders(req) },

      });

      setAuthIntentCookie(response, "sign-up");

      return response;

    }



    if (pathname === "/sign-in") {

      const response = NextResponse.next({

        request: { headers: withRequestHeaders(req) },

      });

      setAuthIntentCookie(response, "sign-in");

      return response;

    }

  }



  if (isProtectedRoute(req)) {

    await auth.protect();

  }



  return NextResponse.next({

    request: { headers: withRequestHeaders(req) },

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


