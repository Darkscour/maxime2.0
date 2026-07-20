"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";

const NOTICES = {
  "existing-account": {
    message:
      "You already have a Maxime account with this email. We sent you to your dashboard instead of creating a duplicate.",
  },
  "existing-account-resume": {
    message:
      "You've already signed up with this email but haven't finished onboarding yet. Pick up where you left off below.",
  },
} as const;

type NoticeKey = keyof typeof NOTICES;

export function AuthNoticeBanner() {
  const searchParams = useSearchParams();
  const noticeKey = searchParams.get("notice") as NoticeKey | null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (noticeKey && noticeKey in NOTICES) {
      setVisible(true);
    }
  }, [noticeKey]);

  if (!visible || !noticeKey || !(noticeKey in NOTICES)) return null;

  const notice = NOTICES[noticeKey];

  function dismiss() {
    setVisible(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("notice");
    const query = params.toString();
    const nextUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }

  return (
    <div
      className="mb-6 flex items-start gap-3 rounded-none border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)]"
      role="status"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
      <p className="flex-1 leading-6">{notice.message}</p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-none p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
