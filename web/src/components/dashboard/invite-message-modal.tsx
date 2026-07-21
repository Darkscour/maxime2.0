"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { fieldClassName } from "@/lib/form-styles";
import { Button } from "@/components/ui/button";

export function InviteMessageModal({
  open,
  playerHandle,
  teamName,
  defaultMessage,
  loading,
  onClose,
  onSend,
}: {
  open: boolean;
  playerHandle: string;
  teamName: string;
  defaultMessage: string;
  loading: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    if (open) setMessage(defaultMessage);
  }, [open, defaultMessage]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-none border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-[var(--foreground-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-heading pr-8 text-lg font-semibold text-[var(--foreground)]">
          Invite {playerHandle}
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Customize the message {playerHandle} sees with your invite from {teamName}.
        </p>

        <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
          Invite message
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldClassName} mt-2 resize-y`}
            placeholder="Write a personal note for this player…"
          />
        </label>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button type="button" size="sm" variant="ghost" disabled={loading} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="primary"
            disabled={loading || !message.trim()}
            onClick={() => onSend(message.trim())}
          >
            {loading ? "Sending…" : "Send invite"}
          </Button>
        </div>
      </div>
    </div>
  );
}
