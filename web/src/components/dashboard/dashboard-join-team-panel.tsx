"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField, TextInput, FormError } from "@/components/onboarding/form-fields";

export function DashboardJoinTeamPanel({
  hasTeam,
}: {
  hasTeam: boolean;
}) {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (hasTeam) {
    return (
      <p className="text-sm text-zinc-400">
        You&apos;re already on a team. Leave your current team before joining another
        (coming soon).
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
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not join team.");
        return;
      }
      setSuccess(data.team?.name ? `Joined ${data.team.name}!` : "Team joined!");
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
