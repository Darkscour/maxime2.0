"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/safe-json";

type TeamOption = { id: string; name: string };
type DuelRow = {
  id: string;
  challengerTeamId: string;
  targetTeamId: string;
  game: string;
  message: string | null;
  scheduledAt: string | Date | null;
  status: string;
  challengerTeam: { id: string; name: string };
  targetTeam: { id: string; name: string };
  createdAt: string | Date;
};

export function DuelsPanel({
  teamId,
  teams,
  initialDuels,
}: {
  teamId: string;
  teams: TeamOption[];
  initialDuels: DuelRow[];
}) {
  const [duels, setDuels] = useState(initialDuels);
  const [targetTeamId, setTargetTeamId] = useState("");
  const [game, setGame] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const incoming = useMemo(
    () => duels.filter((d) => d.targetTeamId === teamId && d.status === "pending"),
    [duels, teamId],
  );
  const sent = useMemo(
    () => duels.filter((d) => d.challengerTeamId === teamId && d.status === "pending"),
    [duels, teamId],
  );
  const history = useMemo(
    () => duels.filter((d) => d.status !== "pending"),
    [duels],
  );

  async function refresh() {
    const res = await fetch("/api/duels/challenges");
    const data = await parseJsonResponse<{ duels?: DuelRow[]; error?: string }>(res);
    if (res.ok && data) setDuels(data.duels ?? []);
  }

  async function createChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!targetTeamId || !game.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/duels/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTeamId, game, message }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error ?? "Could not create duel challenge.");
        return;
      }
      setTargetTeamId("");
      setGame("");
      setMessage("");
      await refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: string) {
    const res = await fetch(`/api/duels/challenges/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={createChallenge}
        className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5"
      >
        <h2 className="font-heading text-lg font-semibold text-white">Start a duel</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Challenge another grassroots team in any game.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <select
            value={targetTeamId}
            onChange={(e) => setTargetTeamId(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-100"
            required
          >
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <input
            value={game}
            onChange={(e) => setGame(e.target.value)}
            placeholder="Game title (e.g. Valorant)"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-100"
            required
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional challenge message"
          className="mt-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-100"
          rows={3}
        />
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        <Button type="submit" size="sm" className="mt-3" disabled={loading}>
          Send challenge
        </Button>
      </form>

      <DuelList
        title="Incoming challenges"
        empty="No incoming challenges."
        duels={incoming}
        teamId={teamId}
        onAction={changeStatus}
      />
      <DuelList
        title="Sent challenges"
        empty="No pending outgoing challenges."
        duels={sent}
        teamId={teamId}
        onAction={changeStatus}
      />
      <DuelList
        title="Duel history"
        empty="No duel history yet."
        duels={history}
        teamId={teamId}
        onAction={changeStatus}
      />
    </div>
  );
}

function DuelList({
  title,
  empty,
  duels,
  teamId,
  onAction,
}: {
  title: string;
  empty: string;
  duels: DuelRow[];
  teamId: string;
  onAction: (id: string, status: string) => Promise<void>;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5">
      <h3 className="font-heading text-base font-semibold text-white">{title}</h3>
      {duels.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {duels.map((duel) => {
            const opponent =
              duel.challengerTeamId === teamId ? duel.targetTeam.name : duel.challengerTeam.name;
            return (
              <li key={duel.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-sm text-zinc-100">
                  {duel.game} vs {opponent}
                </p>
                {duel.message && <p className="mt-1 text-xs text-zinc-500">{duel.message}</p>}
                <p className="mt-1 text-xs uppercase tracking-wider text-cyan-300">
                  {duel.status}
                </p>
                <div className="mt-2 flex gap-2">
                  {duel.status === "pending" && duel.targetTeamId === teamId && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => onAction(duel.id, "accepted")}>
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onAction(duel.id, "declined")}>
                        Decline
                      </Button>
                    </>
                  )}
                  {duel.status === "pending" && duel.challengerTeamId === teamId && (
                    <Button size="sm" variant="ghost" onClick={() => onAction(duel.id, "cancelled")}>
                      Cancel
                    </Button>
                  )}
                  {duel.status === "accepted" && (
                    <Button size="sm" variant="outline" onClick={() => onAction(duel.id, "completed")}>
                      Mark completed
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

