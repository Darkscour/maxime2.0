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
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save settings.");
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
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-16 w-16 rounded-xl object-cover ring-1 ring-inset ring-white/10"
              />
            ) : (
              <span className="font-heading flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-xl font-bold text-zinc-950">
                {initial}
              </span>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface)] ring-1 ring-white/10">
              <Camera className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white" />
            </span>
          </button>
          <div>
            <p className="text-sm text-zinc-300">Upload a photo</p>
            <p className="mt-0.5 text-xs text-zinc-500">JPG or PNG, max 10 MB</p>
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
