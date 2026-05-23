/**
 * Recruitment portal page — Server Component.
 *
 * Runs on the server, fetches players from Postgres via Prisma, then renders
 * the interactive client portal with the data already in hand. No loading
 * spinners on first paint.
 */

import { db } from "@/lib/db";
import type { Player } from "@/lib/mock-data";
import { RecruitmentPortal } from "./recruitment-portal";

// Re-render on every request so newly added players show up immediately
// without rebuilding the site. For high-traffic production you can switch
// this to ISR with `export const revalidate = 60`.
export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
  const dbPlayers = await db.player.findMany({
    orderBy: { fitScore: "desc" },
  });

  // Map Prisma's nullable types onto the strict TypeScript shape the UI
  // already uses. Future fields added in the DB don't need a UI change
  // until you decide to surface them.
  const players: Player[] = dbPlayers.map((p) => ({
    id: p.id,
    handle: p.handle,
    avatarHue: p.avatarHue,
    game: p.game as Player["game"],
    role: p.role,
    rank: p.rank as Player["rank"],
    region: p.region as Player["region"],
    school: p.school ?? undefined,
    age: p.age,
    winRate: p.winRate,
    kda: p.kda,
    hoursPerWeek: p.hoursPerWeek,
    fitScore: p.fitScore,
    tags: p.tags,
    status: p.status as Player["status"],
    verified: p.verified,
  }));

  return <RecruitmentPortal players={players} />;
}
