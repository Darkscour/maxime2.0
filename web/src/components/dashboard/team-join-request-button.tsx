"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/safe-json";
import { cn } from "@/lib/utils";

export function TeamJoinRequestButton({
  teamId,
  teamName,
  disabled,
  disabledReason,
  initialPending,
  embedded = false,
  locked = false,
  currentTeamName,
  canLeaveTeam = false,
}: {
  teamId: string;
  teamName: string;
  disabled?: boolean;
  disabledReason?: string;
  initialPending?: boolean;
  embedded?: boolean;
  /** Already on a team — show locked join CTA with hover leave option */
  locked?: boolean;
  currentTeamName?: string | null;
  canLeaveTeam?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(initialPending ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestJoin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/teams/join-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not send request.");
        return;
      }
      setPending(true);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (locked) {
    return (
      <LockedJoinRequestControl
        embedded={embedded}
        currentTeamName={currentTeamName}
        canLeaveTeam={canLeaveTeam}
      />
    );
  }

  if (disabled) {
    return (
      <p className={embedded ? "text-xs text-[var(--foreground-muted)]" : "mt-4 text-xs text-[var(--foreground-muted)]"}>
        {disabledReason ?? "Unavailable"}
      </p>
    );
  }

  return (
    <div className={embedded ? undefined : "mt-4"}>
      <Button
        type="button"
        size="sm"
        variant={pending ? "outline" : "primary"}
        disabled={loading || pending}
        onClick={requestJoin}
        className={embedded ? "gap-1.5" : undefined}
      >
        {loading ? "Sending…" : pending ? "Request sent" : "Request to join"}
      </Button>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
      {pending && !error && !embedded && (
        <p className="mt-2 text-xs text-[var(--foreground-muted)]">
          {teamName} will be notified. You can still accept a direct invite if they send one.
        </p>
      )}
    </div>
  );
}

function LockedJoinRequestControl({
  embedded,
  currentTeamName,
  canLeaveTeam,
}: {
  embedded: boolean;
  currentTeamName?: string | null;
  canLeaveTeam: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");

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
      setConfirmLeave(false);
      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLeaving(false);
    }
  }

  const teamLabel = currentTeamName?.trim() || "a team";

  return (
    <div
      className={cn("relative inline-flex", !embedded && "mt-4")}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (leaving) return;
        setOpen(false);
        setConfirmLeave(false);
        setError("");
      }}
    >
      <button
        type="button"
        aria-disabled
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          if (leaving) return;
          const next = e.relatedTarget as Node | null;
          if (next && e.currentTarget.parentElement?.contains(next)) return;
          setOpen(false);
          setConfirmLeave(false);
          setError("");
        }}
        className={cn(
          "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-none border border-[var(--border)] px-4 text-sm font-medium tracking-[-0.01em]",
          "bg-[var(--surface-2)] text-[var(--foreground-muted)] opacity-70",
          "cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_50%,transparent)]",
        )}
      >
        <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Request to join
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Cannot request to join"
          className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-md border border-[var(--md-card-border)] bg-[var(--md-card)] p-3 shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <p className="text-xs leading-relaxed text-[var(--md-text-muted)]">
            Can&apos;t request to join — you&apos;re already on{" "}
            <span className="font-medium text-[var(--md-text)]">{teamLabel}</span>.
          </p>

          {error ? (
            <p className="mt-2 text-xs text-red-300">{error}</p>
          ) : null}

          {canLeaveTeam ? (
            <div className="mt-3">
              {!confirmLeave ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5"
                  onClick={() => setConfirmLeave(true)}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Leave team
                </Button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    className="h-8"
                    disabled={leaving}
                    onClick={leaveTeam}
                  >
                    {leaving ? "Leaving…" : "Confirm leave"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8"
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
          ) : (
            <p className="mt-2 text-[11px] leading-relaxed text-[var(--md-text-faint)]">
              Managers and captains manage membership from team settings.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
