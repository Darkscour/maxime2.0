"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Bell, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchJson } from "@/lib/safe-json";
import { useAbortableIntervalFetch } from "@/hooks/use-abortable-interval-fetch";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

const PANEL_BG = "#161a24";
const PANEL_HEADER_BG = "#11141b";

function formatWhen(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function typeTone(type: string) {
  if (type === "recruitment") return "text-violet-300";
  if (type === "analytics") return "text-cyan-300";
  return "text-zinc-300";
}

export function DashboardNotifications() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState<{ top: number; right: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);

  const onNotifications = useCallback(
    (data: { items?: NotificationItem[]; unread?: number }) => {
      setItems(
        (data.items ?? []).map((n: NotificationItem & { createdAt: string }) => ({
          ...n,
          createdAt:
            typeof n.createdAt === "string"
              ? n.createdAt
              : new Date(n.createdAt).toISOString(),
        })),
      );
      setUnread(data.unread ?? 0);
      setLoading(false);
    },
    [],
  );

  useAbortableIntervalFetch("/api/notifications", 60_000, onNotifications, {
    initialDelayMs: 500,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !buttonRef.current) {
      setPanelPos(null);
      return;
    }

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPanelPos({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function markAllRead() {
    const { ok, data } = await fetchJson<{ unread?: number }>("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (ok) {
      setUnread(data?.unread ?? 0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  async function openItem(item: NotificationItem) {
    if (!item.read) {
      void fetchJson("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [item.id] }),
      });
      setUnread((u) => Math.max(0, u - 1));
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
      );
    }
    setOpen(false);
    if (item.href) {
      window.location.assign(item.href);
    }
  }

  const panel =
    open && panelPos ? (
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Notifications"
        className="fixed z-[9999] w-[min(calc(100vw-2rem),22rem)] overflow-hidden rounded-2xl border border-[#2a3042] shadow-[0_24px_64px_rgba(0,0,0,0.85)]"
        style={{
          top: panelPos.top,
          right: panelPos.right,
          backgroundColor: PANEL_BG,
        }}
      >
        <div
          className="flex items-center justify-between border-b border-[#2a3042] px-4 py-3"
          style={{ backgroundColor: PANEL_HEADER_BG }}
        >
          <p className="text-sm font-medium text-white">Notifications</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        <div
          className="max-h-80 overflow-y-auto"
          style={{ backgroundColor: PANEL_BG }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-10 text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-zinc-500">
              No updates yet. Invites, analytics, and recruitment activity will show
              up here.
            </p>
          ) : (
            <ul className="divide-y divide-[#2a3042]">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openItem(item)}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors hover:bg-[#1c2130]",
                      !item.read && "bg-[#1a2838]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          item.read ? "text-zinc-300" : "text-white",
                        )}
                      >
                        {item.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-zinc-600">
                        {formatWhen(item.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                      {item.body}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-[10px] uppercase tracking-wider",
                        typeTone(item.type),
                      )}
                    >
                      {item.type}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className="border-t border-[#2a3042] px-4 py-2"
          style={{ backgroundColor: PANEL_HEADER_BG }}
        >
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            View dashboard →
          </Link>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-zinc-950">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {mounted && panel ? createPortal(panel, document.body) : null}
    </>
  );
}
