"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FormField,
  TextInput,
  FormError,
  StepHeader,
} from "@/components/onboarding/form-fields";
import { OnboardingBackNav } from "@/components/onboarding/onboarding-back-nav";
import {
  buildOnboardingHref,
  onboardingQueryFromSearchParams,
} from "@/lib/onboarding-path";
import { parseJsonResponse } from "@/lib/safe-json";

export function JoinTeamForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboardingQuery = onboardingQueryFromSearchParams(searchParams);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inviteCode.trim() }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not join team.");
        return;
      }
      router.push(buildOnboardingHref("/onboarding/done", onboardingQuery));
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <OnboardingBackNav href="/onboarding/player" label="Back to player profile" />
      <StepHeader
        step="Join a team"
        title="Enter your invite code"
        subtitle="Your captain shares this from their onboarding completion screen."
      />

      <FormError message={error} />

      <FormField label="Team invite code">
        <TextInput
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Paste code from your captain"
          required
        />
      </FormField>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={loading || !inviteCode.trim()}>
          {loading ? "Joining…" : "Join team"}
        </Button>
        <Link
          href={buildOnboardingHref("/onboarding/done", onboardingQuery)}
          className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        >
          Skip for now
        </Link>
      </div>
    </form>
  );
}
