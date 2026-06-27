import { NextResponse } from "next/server";
import { getDashboardContext, markDashboardWelcomed } from "@/lib/auth-user";

/** Mark the overview welcome as seen — called from the client after the user actually views the page. */
export async function POST() {
  try {
    const ctx = await getDashboardContext();
    if (!ctx.hasWelcomedToDashboard) {
      await markDashboardWelcomed(ctx.userId);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not update welcome state." }, { status: 500 });
  }
}
