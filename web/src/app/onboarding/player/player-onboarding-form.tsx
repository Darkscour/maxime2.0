"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FormField,
  TextInput,
  TextArea,
  SelectInput,
  FormError,
  StepHeader,
} from "@/components/onboarding/form-fields";
import {
  ONBOARDING_GAMES,
  ONBOARDING_REGIONS,
  ONBOARDING_RANKS,
  PLAYER_STATUSES,
} from "@/lib/onboarding-options";

export function PlayerOnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [handle, setHandle] = useState("");
  const [game, setGame] = useState("");
  const [role, setRole] = useState("");
  const [rank, setRank] = useState("");
  const [region, setRegion] = useState("");
  const [school, setSchool] = useState("");
  const [age, setAge] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [status, setStatus] = useState("Available");
  const [tags, setTags] = useState("");
  const [bio, setBio] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);

    try {
      const res = await fetch("/api/onboarding/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle,
          game,
          role,
          rank,
          region,
          school: school || undefined,
          age: age ? Number(age) : undefined,
          hoursPerWeek: hoursPerWeek ? Number(hoursPerWeek) : undefined,
          status,
          tags: tagList,
          bio: bio || undefined,
          inviteCode: inviteCode.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      router.push("/onboarding/done");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <StepHeader
        step="Player onboarding"
        title="Build your player profile"
        subtitle="Captains use this info for recruitment fit. Add your team invite code at the end to join your org."
      />

      <FormError message={error} />

      <FormField label="In-game handle" hint="How scouts will find you">
        <TextInput
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Zylith"
          required
          maxLength={32}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Primary game">
          <SelectInput value={game} onChange={(e) => setGame(e.target.value)} required>
            <option value="">Select game</option>
            {ONBOARDING_GAMES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Role">
          <TextInput
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Duelist, Mid, AWPer…"
            required
          />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Rank">
          <SelectInput value={rank} onChange={(e) => setRank(e.target.value)} required>
            <option value="">Select rank</option>
            {ONBOARDING_RANKS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Region">
          <SelectInput
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="">Select region</option>
            {ONBOARDING_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="School" hint="Optional">
          <TextInput
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="UCLA"
          />
        </FormField>

        <FormField label="Age" hint="Optional">
          <TextInput
            type="number"
            min={13}
            max={99}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="20"
          />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Hours played per week" hint="Self-reported estimate for your primary game — include ranked, scrims, and practice">
          <TextInput
            type="number"
            min={0}
            max={168}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="20"
          />
        </FormField>

        <FormField label="Availability">
          <SelectInput value={status} onChange={(e) => setStatus(e.target.value)}>
            {PLAYER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <FormField
        label="Playstyle tags"
        hint="Comma-separated — e.g. Jett main, Shotcaller, Vocal"
      >
        <TextInput
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Aggressive entry, IGL backup"
        />
      </FormField>

      <FormField label="Short bio" hint="Optional — 1–2 sentences">
        <TextArea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Collegiate VALORANT player looking for a structured practice schedule…"
          maxLength={400}
        />
      </FormField>

      <FormField
        label="Team invite code"
        hint="From your captain — join the org now, or skip and join later"
      >
        <TextInput
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Paste invite code"
        />
      </FormField>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={loading || !handle || !game || !role || !rank || !region}
        >
          {loading ? "Saving profile…" : "Save profile & continue"}
        </Button>
        <Link
          href="/onboarding"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back
        </Link>
      </div>
    </form>
  );
}
