import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireTeamMembership } from "@/lib/sponsor-lead-auth";
import { scoreSponsorFit, isSponsorLeadStatus } from "@/lib/sponsor-fit";
import {
  findLeadsByTeamId,
  upsertSponsorLead,
  updateSponsorLead,
} from "@/lib/sponsor-lead-store";

export async function GET() {
  try {
    const { teamId } = await requireTeamMembership();
    const leads = await findLeadsByTeamId(teamId);
    return NextResponse.json({ ok: true, leads });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (e instanceof Error && e.message === "NO_TEAM") {
      return NextResponse.json({ error: "Join or create a team first." }, { status: 403 });
    }
    console.error("[sponsorship/leads GET]", e);
    return NextResponse.json({ error: "Could not load pipeline." }, { status: 500 });
  }
}

type PostBody = {
  sponsorId: string;
  sponsorName: string;
  industry?: string;
  difficulty?: string;
  sponsorLink?: string;
};

export async function POST(req: Request) {
  try {
    const { teamId } = await requireTeamMembership();
    const team = await db.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    const body = (await req.json()) as PostBody;
    const sponsorId = body.sponsorId?.trim();
    const sponsorName = body.sponsorName?.trim();
    if (!sponsorId || !sponsorName) {
      return NextResponse.json({ error: "Sponsor id and name required." }, { status: 400 });
    }

    const fit = scoreSponsorFit(team, {
      difficulty: body.difficulty ?? "—",
      industry: body.industry ?? "—",
    });

    const lead = await upsertSponsorLead({
      teamId,
      sponsorId,
      sponsorName,
      industry: body.industry ?? null,
      difficulty: body.difficulty ?? null,
      sponsorLink: body.sponsorLink ?? null,
      fitScore: fit.score,
      fitReason: fit.reason,
    });

    return NextResponse.json({ ok: true, lead });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (e instanceof Error && e.message === "NO_TEAM") {
      return NextResponse.json({ error: "Join or create a team first." }, { status: 403 });
    }
    console.error("[sponsorship/leads POST]", e);
    return NextResponse.json({ error: "Could not save sponsor." }, { status: 500 });
  }
}

type PatchBody = {
  sponsorId?: string;
  leadId?: string;
  status?: string;
  notes?: string;
};

export async function PATCH(req: Request) {
  try {
    const { teamId } = await requireTeamMembership();
    const body = (await req.json()) as PatchBody;

    if (body.status && !isSponsorLeadStatus(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const lead = await updateSponsorLead({
      teamId,
      leadId: body.leadId,
      sponsorId: body.sponsorId,
      status: body.status as import("@/lib/sponsor-fit").SponsorLeadStatus | undefined,
      notes: body.notes !== undefined ? body.notes.trim() || null : undefined,
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, lead });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (e instanceof Error && e.message === "NO_TEAM") {
      return NextResponse.json({ error: "Join or create a team first." }, { status: 403 });
    }
    console.error("[sponsorship/leads PATCH]", e);
    return NextResponse.json({ error: "Could not update lead." }, { status: 500 });
  }
}
