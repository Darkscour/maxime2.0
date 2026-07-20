"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { Building2, Globe, Upload, Users, X } from "lucide-react";
import {
  ONBOARDING_GAMES,
  ONBOARDING_REGIONS,
  getGameLogoPath,
} from "@/lib/onboarding-options";
import { parseJsonResponse } from "@/lib/safe-json";
import {
  estimateDataUrlBytes,
  TEAM_PROFILE_IMAGE_DATA_URL_PATTERN,
} from "@/lib/team-profile-image";
import {
  SettingsAlert,
  SettingsChip,
  SettingsField,
  SettingsFooter,
  SettingsHero,
  SettingsInput,
  SettingsSection,
  SettingsSelect,
} from "@/components/dashboard/settings/settings-ui";

const MAX_UPLOAD_FILE_BYTES = 500 * 1024;
const MAX_DATA_URL_BYTES = 700 * 1024;
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export type TeamProfileFormData = {
  name: string;
  school: string;
  games: string[];
  region: string;
  rosterSize: string;
  discordUrl: string;
  profileImageUrl: string;
};

export function TeamProfileEditForm({ initial }: { initial: TeamProfileFormData }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initial.name);
  const [school, setSchool] = useState(initial.school);
  const [games, setGames] = useState<string[]>(initial.games);
  const [region, setRegion] = useState(initial.region);
  const [rosterSize, setRosterSize] = useState(initial.rosterSize);
  const [discordUrl, setDiscordUrl] = useState(initial.discordUrl);
  const [profileImageUrl, setProfileImageUrl] = useState(initial.profileImageUrl);
  const [uploadingImage, setUploadingImage] = useState(false);

  function toggleGame(game: string) {
    setGames((prev) =>
      prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/team/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          school: school || undefined,
          games,
          region: region || undefined,
          rosterSize: rosterSize ? Number(rosterSize) : undefined,
          discordUrl: discordUrl || undefined,
          profileImageUrl: profileImageUrl || null,
        }),
      });

      const data = await parseJsonResponse<{ error?: string; code?: string }>(res);
      if (!res.ok) {
        setError(getTeamProfileErrorMessage(data?.code, data?.error));
        return;
      }

      setSuccess("Saved");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <SettingsHero
        eyebrow="Team"
        accent="cyan"
        title="Org profile"
        description="Your team's public identity — titles, region, and roster size."
        preview={
          <div className="inline-flex items-center gap-3 rounded-none border border-[var(--border)] bg-[var(--background)] px-4 py-3 backdrop-blur-sm">
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt={`${name || "Team"} profile`}
                className="h-11 w-11 rounded-none object-cover ring-1 ring-inset ring-[var(--border)]"
              />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-none bg-[var(--background)] ring-1 ring-inset ring-[var(--border)]">
                <Building2 className="h-5 w-5 text-[var(--accent-2)]" />
              </span>
            )}
            <div>
              <p className="font-heading text-base font-semibold text-[var(--foreground)]">
                {name || "Your team"}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                {games.length > 0
                  ? `${games.length} title${games.length === 1 ? "" : "s"} · ${region || "No region"}`
                  : "Add competitive titles"}
              </p>
            </div>
          </div>
        }
      />

      {error && <SettingsAlert tone="error" message={error} />}
      {success && <SettingsAlert tone="success" message={success} />}

      <div className="space-y-5">
        <SettingsSection
          icon={Building2}
          title="Organization"
          description="How your org appears across Maxime."
        >
          <SettingsField label="Team name">
            <SettingsInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Penn State Valorant"
              required
              maxLength={80}
              className="font-heading text-base"
            />
          </SettingsField>
          <SettingsField label="School / university" hint="Optional">
            <SettingsInput
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Penn State University"
            />
          </SettingsField>
        </SettingsSection>

        <SettingsSection
          icon={Users}
          title="Competitive titles"
          description="Every game your org competes in — no single primary title."
        >
          <div className="flex flex-wrap gap-2">
            {ONBOARDING_GAMES.map((game) => {
              const logoPath = getGameLogoPath(game);
              return (
                <SettingsChip
                  key={game}
                  active={games.includes(game)}
                  onClick={() => toggleGame(game)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {logoPath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoPath}
                        alt=""
                        className="h-4 w-4 rounded object-contain"
                      />
                    ) : null}
                    {game}
                  </span>
                </SettingsChip>
              );
            })}
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Globe}
          title="Region & roster"
          description="Location and roster size for recruitment and sponsors."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <SettingsField label="Primary region">
              <SettingsSelect
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">Select region</option>
                {ONBOARDING_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </SettingsSelect>
            </SettingsField>
            <SettingsField label="Roster size" hint="Active players">
              <SettingsInput
                type="number"
                min={1}
                max={99}
                value={rosterSize}
                onChange={(e) => setRosterSize(e.target.value)}
                placeholder="8"
              />
            </SettingsField>
          </div>
          <SettingsField label="Discord invite">
            <SettingsInput
              value={discordUrl}
              onChange={(e) => setDiscordUrl(e.target.value)}
              placeholder="https://discord.gg/..."
            />
          </SettingsField>
        </SettingsSection>

        <SettingsSection
          icon={Upload}
          title="Profile picture"
          description="Shown in your dashboard workspace header and org identity surfaces."
        >
          <SettingsField
            label="Team image"
            hint="PNG, JPG, or WEBP up to roughly 500KB recommended"
          >
            <div className="flex flex-wrap items-center gap-3">
              {profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImageUrl}
                  alt={`${name || "Team"} profile`}
                  className="h-16 w-16 rounded-none border border-[var(--border)] object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-none border border-dashed border-[var(--border)] bg-[var(--background)]">
                  <Building2 className="h-5 w-5 text-[var(--foreground-muted)]" />
                </span>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground-muted)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]">
                <Upload className="h-4 w-4" />
                {uploadingImage ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    setError("");
                    const input = e.target;
                    const file = input.files?.[0];
                    if (!file) return;
                    try {
                      if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
                        setError("Unsupported image format. Use PNG, JPG, or WEBP.");
                        input.value = "";
                        return;
                      }

                      const processedFile =
                        file.size > MAX_UPLOAD_FILE_BYTES
                          ? await optimizeImageForUpload(file)
                          : file;

                      setUploadingImage(true);
                      try {
                        const blob = await upload(
                          `team-profile-${Date.now()}.${extensionForMime(processedFile.type)}`,
                          processedFile,
                          {
                            access: "public",
                            handleUploadUrl: "/api/team/profile/upload",
                          },
                        );
                        setProfileImageUrl(blob.url);
                      } catch {
                        // Fallback for local/dev setups without blob storage configured.
                        const dataUrl = await fileToDataUrl(processedFile);
                        if (
                          !TEAM_PROFILE_IMAGE_DATA_URL_PATTERN.test(dataUrl) ||
                          estimateDataUrlBytes(dataUrl) > MAX_DATA_URL_BYTES
                        ) {
                          throw new Error("profile-image-too-large");
                        }
                        setProfileImageUrl(dataUrl);
                      }
                    } catch (err) {
                      if (
                        err instanceof Error &&
                        err.message === "profile-image-too-large"
                      ) {
                        setError("Image is too large. Try a smaller PNG/JPG/WEBP file.");
                      } else {
                        setError("Could not upload this image. Try again.");
                      }
                    } finally {
                      setUploadingImage(false);
                    }
                    input.value = "";
                  }}
                />
              </label>
              {profileImageUrl && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground-muted)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  onClick={() => setProfileImageUrl("")}
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
          </SettingsField>
        </SettingsSection>
      </div>

      <SettingsFooter
        loading={loading}
        disabled={!name || games.length === 0}
        submitLabel="Save team"
      />
    </form>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("file-read-failed"));
    reader.readAsDataURL(file);
  });
}

async function optimizeImageForUpload(file: File): Promise<File> {
  const imgDataUrl = await fileToDataUrl(file);
  const img = await loadImage(imgDataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-context-unavailable");

  const maxDimensions = [768, 640, 512, 384, 320];
  const qualities = [0.82, 0.72, 0.64, 0.56, 0.48];
  let bestAttempt: File | null = null;

  for (const maxDimension of maxDimensions) {
    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    for (const quality of qualities) {
      const webpAttempt = await canvasToFile(
        canvas,
        "image/webp",
        "team-profile.webp",
        quality,
      );
      if (!bestAttempt || webpAttempt.size < bestAttempt.size) {
        bestAttempt = webpAttempt;
      }
      if (webpAttempt.size <= MAX_UPLOAD_FILE_BYTES) {
        return webpAttempt;
      }
    }
  }

  if (!bestAttempt) {
    throw new Error("image-encode-failed");
  }

  if (bestAttempt.size <= MAX_UPLOAD_FILE_BYTES) {
    return bestAttempt;
  }

  throw new Error("image-too-large");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image-load-failed"));
    img.src = src;
  });
}

function canvasToFile(
  canvas: HTMLCanvasElement,
  type: string,
  filename: string,
  quality: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("image-encode-failed"));
          return;
        }
        resolve(new File([blob], filename, { type }));
      },
      type,
      quality,
    );
  });
}

function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  return "webp";
}

function getTeamProfileErrorMessage(code?: string, fallback?: string): string {
  switch (code) {
    case "FORBIDDEN_TEAM_EDIT":
      return "Only team captains or managers can edit this profile.";
    case "NO_TEAM":
      return "No team found for this account. Rejoin your team and try again.";
    case "ONBOARDING_INCOMPLETE":
      return "Complete onboarding before editing team profile settings.";
    case "INVALID_IMAGE_FORMAT":
      return "Unsupported image format. Use PNG, JPG, or WEBP.";
    case "PROFILE_IMAGE_TOO_LARGE":
      return "Image is too large. Try a smaller file under 500KB.";
    case "MISSING_TEAM_COLUMN":
      return "Team image storage is not ready yet. Please try again shortly.";
    case "REQUEST_TOO_LARGE":
      return "Image request is too large. Use a smaller image and try again.";
    case "UPLOAD_INIT_FAILED":
      return "Storage is unavailable right now. Image fallback will be used on retry.";
    default:
      return fallback || "Something went wrong.";
  }
}
