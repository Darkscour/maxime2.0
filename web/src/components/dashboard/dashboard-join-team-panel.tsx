"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, TextInput, FormError } from "@/components/onboarding/form-fields";
import { parseJsonResponse } from "@/lib/safe-json";

export function DashboardJoinTeamPanel({
  hasTeam,
  teamName,
  membershipRole,
}: {
  hasTeam: boolean;
  teamName?: string | null;
  membershipRole?: string | null;
}) {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [leftTeam, setLeftTeam] = useState(false);

  const blockedOnTeam = hasTeam && !leftTeam;

  async function leaveTeam() {
    setError("");
    setLeaving(true);
    try {
      const res = await fetch("/api/player/leave-team", { method: "POST" });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not leave team.");
        return;
      }
      setLeftTeam(true);
      setConfirmLeave(false);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLeaving(false);
    }
  }

  if (blockedOnTeam && membershipRole === "player") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">
          You&apos;re on{" "}
          <span className="font-medium text-zinc-200">{teamName ?? "a team"}</span>.
          Leave your current roster before joining another with an invite code.
        </p>
        {error && <FormError message={error} />}
        {!confirmLeave ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setConfirmLeave(true)}
          >
            <LogOut className="h-3.5 w-3.5" />
            Leave current team
          </Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="primary"
              disabled={leaving}
              onClick={leaveTeam}
            >
              {leaving ? "Leaving…" : "Confirm leave"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={leaving}
              onClick={() => {
                setConfirmLeave(false);
                setError("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (blockedOnTeam) {
    return (
      <p className="text-sm text-zinc-400">
        You&apos;re already on a team. Managers and captains manage membership from
        team settings.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inviteCode.trim() }),
      });
      const data = await parseJsonResponse<{ error?: string; team?: { name?: string } }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not join team.");
        return;
      }
      setSuccess(data?.team?.name ? `Joined ${data.team.name}!` : "Team joined!");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormError message={error} />
      {success && (
        <p className="text-sm text-emerald-300" role="status">
          {success}
        </p>
      )}
      <FormField
        label="Team invite code"
        hint="Ask a captain for their code — paste it here to join instantly"
      >
        <TextInput
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Paste invite code"
        />
      </FormField>
      <Button type="submit" size="sm" disabled={loading || !inviteCode.trim()}>
        {loading ? "Joining…" : "Join with code"}
      </Button>
    </form>
  );
}
