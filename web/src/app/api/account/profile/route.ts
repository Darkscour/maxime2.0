import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUserAccount } from "@/lib/auth-user";

type Body = {
  displayName?: string;
};

export async function PATCH(req: Request) {
  try {
    const account = await getOrCreateUserAccount();
    if (!account) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const displayName = body.displayName?.trim();

    if (!displayName) {
      return NextResponse.json(
        { error: "Display name is required." },
        { status: 400 },
      );
    }

    if (displayName.length > 80) {
      return NextResponse.json(
        { error: "Display name is too long." },
        { status: 400 },
      );
    }

    const updated = await db.userAccount.update({
      where: { id: account.id },
      data: { displayName },
      select: { displayName: true, email: true },
    });

    return NextResponse.json({ ok: true, account: updated });
  } catch (e) {
    console.error("[account/profile]", e);
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }
}
