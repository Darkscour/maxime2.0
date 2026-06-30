"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Clock, Gamepad2, Sparkles, UserRound } from "lucide-react";
import { BioCharacterCount } from "@/components/onboarding/bio-character-count";
import { PlayerScoutCard } from "@/components/dashboard/player-scout-card";
import {
  ONBOARDING_GAMES,
  ONBOARDING_REGIONS,
  getRanksForGame,
  PLAYER_BIO_MAX_LENGTH,
  PLAYER_STATUSES,
} from "@/lib/onboarding-options";
import { parseJsonResponse } from "@/lib/safe-json";
import {
  SettingsAlert,
  SettingsChip,
  SettingsField,
  SettingsFooter,
  SettingsHero,
  SettingsInput,
  SettingsSection,
  SettingsSelect,
  SettingsTextarea,
} from "@/components/dashboard/settings/settings-ui";

export type PlayerProfileFormData = {
  handle: string;
  game: string;
  role: string;
  rank: string;
  region: string;
  school: string;
  age: string;
  hoursPerWeek: string;
  status: string;
  tags: string;
  bio: string;
};

export function PlayerProfileEditForm({
  initial,
  showSchoolField = true,
}: {
  initial: PlayerProfileFormData;
  showSchoolField?: boolean;
}) {
  const router = useRouter();
  const { user } = useUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [handle, setHandle] = useState(initial.handle);
  const [game, setGame] = useState(initial.game);
  const [role, setRole] = useState(initial.role);
  const [rank, setRank] = useState(initial.rank);
  const [region, setRegion] = useState(initial.region);
  const [school, setSchool] = useState(initial.school);
  const [age, setAge] = useState(initial.age);
  const [hoursPerWeek, setHoursPerWeek] = useState(initial.hoursPerWeek);
  const [status, setStatus] = useState(initial.status);
  const [tags, setTags] = useState(initial.tags);
  const [bio, setBio] = useState(initial.bio);

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
      const res = await fetch("/api/player/profile", {
        method: "PATCH",
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
        }),
      });

      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const valid = !!(handle && game && role && rank && region);

  return (
    <form onSubmit={handleSubmit}>
      <SettingsHero
        eyebrow="Account"
        accent="violet"
        title="Your player card"
        description="Shape how captains and scouts see you — competitive details, availability, and the story behind your playstyle."
        preview={
          <PlayerScoutCard
            handle={handle}
            game={game}
            role={role}
            rank={rank}
            school={school || null}
            imageUrl={user?.imageUrl}
          />
        }
      />

      {error && <SettingsAlert tone="error" message={error} />}

      <div className="space-y-5">
        <SettingsSection
          icon={UserRound}
          title="Identity"
          description="The name and background scouts recognize first."
        >
          <SettingsField label="In-game handle" hint="2–32 characters · must be unique">
            <SettingsInput
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Zylith"
              required
              maxLength={32}
              className="font-heading text-base"
            />
          </SettingsField>
          <div className="grid gap-6 sm:grid-cols-2">
            {showSchoolField && (
              <SettingsField label="School" hint="Optional">
                <SettingsInput
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="UCLA"
                />
              </SettingsField>
            )}
            <SettingsField label="Age" hint="Optional">
              <SettingsInput
                type="number"
                min={13}
                max={99}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="20"
              />
            </SettingsField>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Gamepad2}
          title="Competitive"
          description="Game, role, and rank — the core of recruitment fit."
        >
          <SettingsField label="Primary title">
            <div className="flex flex-wrap gap-2">
              {ONBOARDING_GAMES.map((g) => (
                <SettingsChip
                  key={g}
                  active={game === g}
                  onClick={() => {
                    if (game !== g) setRank("");
                    setGame(g);
                  }}
                >
                  {g}
                </SettingsChip>
              ))}
            </div>
          </SettingsField>
          <div className="grid gap-6 sm:grid-cols-2">
            <SettingsField label="Role">
              <SettingsInput
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Duelist, Mid, AWPer…"
                required
              />
            </SettingsField>
            <SettingsField label="Rank">
              <SettingsSelect
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                required
              >
                <option value="">
                  {game ? "Select rank" : "Select a game first"}
                </option>
                {getRanksForGame(game).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </SettingsSelect>
            </SettingsField>
          </div>
          <SettingsField label="Region">
            <SettingsSelect
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
            </SettingsSelect>
          </SettingsField>
        </SettingsSection>

        <SettingsSection
          id="play-time"
          icon={Clock}
          title="Schedule"
          description="Self-reported availability — captains use this for roster planning."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <SettingsField
              label="Hours per week"
              hint="Ranked, scrims, and team practice combined"
            >
              <div className="flex items-center gap-3">
                <SettingsInput
                  type="number"
                  min={0}
                  max={168}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  placeholder="20"
                  className="max-w-[140px]"
                />
                <span className="text-sm text-zinc-500">hrs / week</span>
              </div>
            </SettingsField>
            <SettingsField label="Availability">
              <SettingsSelect
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {PLAYER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </SettingsSelect>
            </SettingsField>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Sparkles}
          title="Scout card"
          description="Tags and bio — what makes you stand out beyond stats."
        >
          <SettingsField
            label="Playstyle tags"
            hint="Comma-separated · up to 6"
          >
            <SettingsInput
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Aggressive entry, IGL backup, Vocal"
            />
          </SettingsField>
          <SettingsField
            label="Bio"
            hint={`1–2 sentences · optional · max ${PLAYER_BIO_MAX_LENGTH} characters`}
          >
            <SettingsTextarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Collegiate VALORANT player looking for a structured practice schedule…"
              maxLength={PLAYER_BIO_MAX_LENGTH}
            />
            <BioCharacterCount length={bio.length} max={PLAYER_BIO_MAX_LENGTH} />
          </SettingsField>
        </SettingsSection>
      </div>

      <SettingsFooter loading={loading} disabled={!valid} />
    </form>
  );
}
