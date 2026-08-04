"use client";

import { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Camera, UserRound } from "lucide-react";
import {
  SettingsAlert,
  SettingsField,
  SettingsFooter,
  SettingsInput,
  SettingsSection,
} from "@/components/dashboard/settings/settings-ui";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { parseJsonResponse } from "@/lib/safe-json";

export function AccountSettingsForm({
  initialDisplayName,
  initialEmail,
}: {
  initialDisplayName: string;
  initialEmail: string | null;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [email, setEmail] = useState(initialEmail ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const avatarUrl = user?.imageUrl;
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setPhotoLoading(true);
    setError("");
    try {
      await user.setProfileImage({ file });
      router.refresh();
      setSuccess("Profile photo updated.");
    } catch {
      setError("Could not upload photo. Try a JPG or PNG under 10 MB.");
    } finally {
      setPhotoLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const parts = displayName.trim().split(/\s+/);
      const firstName = parts[0] ?? "";
      const lastName = parts.slice(1).join(" ");

      await user.update({ firstName, lastName: lastName || undefined });

      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not save settings.");
        return;
      }

      const trimmedEmail = email.trim();
      const currentEmail = user.primaryEmailAddress?.emailAddress;
      if (trimmedEmail && trimmedEmail !== currentEmail) {
        try {
          const created = await user.createEmailAddress({ email: trimmedEmail });
          await user.update({ primaryEmailAddressId: created.id });
          setSuccess("Settings saved. Check your inbox to verify the new email.");
        } catch {
          setSuccess("Name saved. Email changes may require verification in Manage sign-in.");
        }
      } else {
        setSuccess("Settings saved.");
      }

      router.refresh();
    } catch {
      setError("Could not save settings. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <SettingsAlert tone="error" message={error} />}
      {success && <SettingsAlert tone="success" message={success} />}

      <SettingsSection
        icon={UserRound}
        title="Profile photo"
        description="Shown on your account and in the sidebar."
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={photoLoading}
            className="group relative shrink-0"
          >
            <ProfileAvatar
              src={avatarUrl}
              size={64}
              className="ring-1 ring-inset ring-[var(--border)] bg-[var(--foreground)]"
              fallback={
                <span className="font-heading text-xl font-bold text-[var(--background)]">
                  {initial}
                </span>
              }
            />
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface)] ring-1 ring-[var(--border)]">
              <Camera className="h-3.5 w-3.5 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]" />
            </span>
          </button>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Upload a photo</p>
            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">JPG or PNG, max 10 MB</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        icon={UserRound}
        title="Identity"
        description="How you appear across Maxime."
      >
        <SettingsField label="Display name">
          <SettingsInput
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            required
            maxLength={80}
          />
        </SettingsField>
        <SettingsField label="Email" hint="Changing email may require verification">
          <SettingsInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
          />
        </SettingsField>
      </SettingsSection>

      <SettingsFooter
        loading={loading}
        disabled={!displayName.trim()}
        submitLabel="Save account"
      />
    </form>
  );
}
