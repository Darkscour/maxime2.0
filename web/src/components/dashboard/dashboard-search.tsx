"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  keywords: string[];
};

function buildSearchItems(
  accountType: string | null,
  accountTier: string | null,
): SearchItem[] {
  const common: SearchItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      description: "Home overview and stats",
      href: "/dashboard",
      keywords: ["home", "overview", "stats", "analytics"],
    },
    {
      id: "account",
      label: "Account settings",
      description: "Email, password, and security",
      href: "/dashboard/settings/account",
      keywords: ["account", "email", "password", "security", "2fa"],
    },
  ];

  if (accountType === "team_manager") {
    const opsHref =
      accountTier === "grassroots" ? "/dashboard/duels" : "/dashboard/sponsorships";
    const opsLabel = accountTier === "grassroots" ? "Duels" : "Sponsorships";
    return [
      ...common,
      {
        id: "scout",
        label: "Scout players",
        description: "Search and recruit talent",
        href: "/dashboard/scout",
        keywords: ["scout", "players", "recruit", "search", "talent", "find"],
      },
      {
        id: "roster",
        label: "Roster",
        description: "Your team lineup",
        href: "/dashboard/roster",
        keywords: ["roster", "team", "lineup", "members"],
      },
      {
        id: "join-requests",
        label: "Join requests",
        description: "Players asking to join your team",
        href: "/dashboard/join-requests",
        keywords: ["join", "requests", "applications", "pending"],
      },
      {
        id: "watchlist",
        label: "Watchlist",
        description: "Players you are tracking",
        href: "/dashboard/watchlist",
        keywords: ["watchlist", "shortlist", "saved", "bookmark"],
      },
      {
        id: "team-profile",
        label: "Team profile",
        description: "Edit how your team appears to recruits",
        href: "/dashboard/settings/team",
        keywords: ["team", "profile", "settings", "recruitment"],
      },
      {
        id: "ops",
        label: opsLabel,
        description: accountTier === "grassroots" ? "Match duels" : "Sponsor opportunities",
        href: opsHref,
        keywords: ["duels", "sponsors", "sponsorship", "matches"],
      },
    ];
  }

  return [
    ...common,
    {
      id: "teams",
      label: "Browse teams",
      description: "Find teams recruiting in your game",
      href: "/dashboard/teams",
      keywords: ["teams", "browse", "directory", "recruiting", "join"],
    },
    {
      id: "invites",
      label: "Team invites",
      description: "Offers and recruitment messages",
      href: "/dashboard/invites",
      keywords: ["invites", "offers", "recruitment", "inbox"],
    },
    {
      id: "scout-profile",
      label: "Scout profile",
      description: "Game, role, rank, and visibility",
      href: "/dashboard/settings/profile",
      keywords: ["profile", "scout", "game", "role", "rank", "hours", "bio", "tags"],
    },
    {
      id: "scout-directory",
      label: "Scout directory",
      description: "See how managers browse players",
      href: "/dashboard/scout",
      keywords: ["scout", "directory", "players"],
    },
  ];
}

function matchesQuery(item: SearchItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [item.label, item.description, ...item.keywords].join(" ").toLowerCase();
  return haystack.includes(q);
}

export function DashboardSearch({
  accountType,
  accountTier,
}: {
  accountType: string | null;
  accountTier: string | null;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo(
    () => buildSearchItems(accountType, accountTier),
    [accountType, accountTier],
  );

  const results = useMemo(() => {
    const filtered = items.filter((item) => matchesQuery(item, query));
    return filtered.slice(0, 8);
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex].href);
    }
  }

  const showSuggestions = open && results.length > 0;

  return (
    <div ref={rootRef} className="md-top-search-wrap">
      <div className={cn("md-top-search", open && "md-top-search-open")} role="search">
        <Search size={14} aria-hidden />
        <input
          ref={inputRef}
          type="search"
          className="md-top-search-input"
          placeholder="Search dashboard…"
          aria-label="Search dashboard"
          aria-expanded={showSuggestions}
          aria-controls={showSuggestions ? listId : undefined}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>
      {showSuggestions ? (
        <ul id={listId} className="md-top-search-suggestions" role="listbox">
          {results.map((item, index) => (
            <li key={item.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={cn(
                  "md-top-search-option",
                  index === activeIndex && "md-top-search-option-active",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(item.href)}
              >
                <span className="md-top-search-option-label">{item.label}</span>
                <span className="md-top-search-option-desc">{item.description}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
