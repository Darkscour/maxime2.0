"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { upload } from "@vercel/blob/client";
import { Building2, Camera, Star } from "lucide-react";
import {
  estimateDataUrlBytes,
  TEAM_PROFILE_IMAGE_DATA_URL_PATTERN,
} from "@/lib/team-profile-image";
import type { DeskIdentity, DeskTeamProfileSnapshot } from "@/components/dashboard/desk-mantine";

const MAX_DATA_URL_BYTES = 700 * 1024;
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export function DeskIdentityAvatar({
  identity,
  teamProfileSnapshot,
}: {
  identity: DeskIdentity;
  teamProfileSnapshot?: DeskTeamProfileSnapshot | null;
}) {
  const router = useRouter();
  const { user } = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  const clerkUrl = user?.imageUrl ?? null;
  const displayUrl =
    localImageUrl ??
    identity.imageUrl ??
    (identity.kind === "player" ? clerkUrl : null);

  async function saveTeamImage(url: string) {
    if (!teamProfileSnapshot) return;
    const res = await fetch("/api/team/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: teamProfileSnapshot.name,
        school: teamProfileSnapshot.school || undefined,
        games: teamProfileSnapshot.games,
        region: teamProfileSnapshot.region || undefined,
        rosterSize: teamProfileSnapshot.rosterSize ?? undefined,
        discordUrl: teamProfileSnapshot.discordUrl ?? undefined,
        profileImageUrl: url,
      }),
    });
    if (!res.ok) {
      throw new Error("team-profile-save-failed");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      if (identity.kind === "player") {
        if (!user) return;
        await user.setProfileImage({ file });
        setLocalImageUrl(URL.createObjectURL(file));
        router.refresh();
        return;
      }

      if (!teamProfileSnapshot) return;

      let imageUrl: string;
      try {
        const blob = await upload(
          `team-profile-${Date.now()}.${extensionForMime(file.type)}`,
          file,
          {
            access: "public",
            handleUploadUrl: "/api/team/profile/upload",
          },
        );
        imageUrl = blob.url;
      } catch {
        const dataUrl = await fileToDataUrl(file);
        if (
          !TEAM_PROFILE_IMAGE_DATA_URL_PATTERN.test(dataUrl) ||
          estimateDataUrlBytes(dataUrl) > MAX_DATA_URL_BYTES
        ) {
          throw new Error("profile-image-too-large");
        }
        imageUrl = dataUrl;
      }

      await saveTeamImage(imageUrl);
      setLocalImageUrl(imageUrl);
      router.refresh();
    } catch {
      /* silent — user can retry from settings */
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const canEdit =
    identity.kind === "player"
      ? !!user
      : !!teamProfileSnapshot;

  const inner = (
    <>
      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={displayUrl} alt="" className="md-identity-avatar-img" />
      ) : identity.kind === "org" ? (
        <Building2 size={24} />
      ) : (
        <Star size={24} />
      )}
      {canEdit ? (
        <span className="md-identity-avatar-overlay" aria-hidden>
          <Camera size={18} />
        </span>
      ) : null}
    </>
  );

  if (!canEdit) {
    return (
      <div className="md-identity-avatar" aria-hidden>
        {inner}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="md-identity-avatar-btn"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        aria-label={uploading ? "Uploading photo" : "Change profile photo"}
        title={uploading ? "Uploading…" : "Change photo"}
      >
        <span className="md-identity-avatar">{inner}</span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
