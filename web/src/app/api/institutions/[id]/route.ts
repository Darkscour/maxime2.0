import { NextResponse } from "next/server";
import { getInstitutionById } from "@/lib/institutions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const institution = await getInstitutionById(id);

  if (!institution) {
    return NextResponse.json({ error: "Institution not found." }, { status: 404 });
  }

  return NextResponse.json({ institution });
}
