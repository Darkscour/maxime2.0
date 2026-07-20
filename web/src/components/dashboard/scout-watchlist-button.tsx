"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/safe-json";

export function ScoutWatchlistButton({
  playerProfileId,
  initialOnWatchlist,
  canManage,
}: {
  playerProfileId: string;
  initialOnWatchlist: boolean;
  canManage: boolean;
}) {
  const router = useRouter();
  const [onWatchlist, setOnWatchlist] = useState(initialOnWatchlist);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!canManage) {
    return (
      <p className="text-sm text-[var(--foreground-muted)]">
        Set up your team profile to add players to your watchlist.
      </p>
    );
  }

  async function toggleWatchlist() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: onWatchlist ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerProfileId }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not update watchlist.");
        return;
      }
      setOnWatchlist(!onWatchlist);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={onWatchlist ? "outline" : "primary"}
        size="sm"
        disabled={loading}
        onClick={toggleWatchlist}
        className="gap-2"
      >
        {onWatchlist ? (
          <>
            <BookmarkCheck className="h-4 w-4" />
            On watchlist
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />
            Add to watchlist
          </>
        )}
      </Button>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
