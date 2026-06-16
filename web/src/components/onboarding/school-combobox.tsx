"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import type { InstitutionListItem } from "@/lib/institutions";
import { InstitutionLogoWithFallback } from "@/components/onboarding/institution-logo";
import { fieldClassName } from "@/lib/form-styles";
import { cn } from "@/lib/utils";

type SchoolComboboxProps = {
  value: InstitutionListItem | null;
  onChange: (institution: InstitutionListItem | null) => void;
  label?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
};

export function SchoolCombobox({
  value,
  onChange,
  label = "School / university",
  hint = "Search U.S. colleges and universities",
  required,
  placeholder = "Search by school name…",
}: SchoolComboboxProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<InstitutionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [searchError, setSearchError] = useState("");

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setSearchError("");
    try {
      const res = await fetch(
        `/api/institutions/search?q=${encodeURIComponent(q.trim())}`,
      );
      const data = (await res.json()) as {
        results?: InstitutionListItem[];
        needsBootstrap?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setResults([]);
        setSearchError(data.error ?? "Could not load schools.");
        return;
      }
      setResults(data.results ?? []);
      setNeedsBootstrap(!!data.needsBootstrap);
    } catch {
      setResults([]);
      setSearchError("Could not load schools. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      void search(query);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [open, query, search]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function select(institution: InstitutionListItem) {
    onChange(institution);
    setQuery("");
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setQuery("");
    setResults([]);
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="block">
        <span className="text-sm font-medium text-zinc-200">
          {label}
          {required && <span className="text-red-400"> *</span>}
        </span>
        {hint && (
          <span className="mt-0.5 block text-xs text-zinc-500">{hint}</span>
        )}

        {value ? (
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-[var(--background)] px-3 py-2.5">
            <InstitutionLogoWithFallback
              name={value.name}
              logoUrl={value.logoUrl}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-100">
                {value.name}
              </p>
              {(value.city || value.state) && (
                <p className="truncate text-xs text-zinc-500">
                  {[value.city, value.state].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={clear}
              className="rounded-md p-1 text-zinc-500 hover:bg-white/5 hover:text-white"
              aria-label="Clear school selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className={cn(fieldClassName, "pl-9 pr-9")}
              autoComplete="off"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              required={required}
            />
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        )}
      </label>

      {open && !value && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0c0e12] py-1 shadow-xl shadow-black/40"
        >
          {searchError && (
            <li className="px-3 py-3 text-xs leading-5 text-red-300/90">
              {searchError}
            </li>
          )}

          {needsBootstrap && !searchError && (
            <li className="px-3 py-3 text-xs leading-5 text-amber-200/90">
              School list not loaded yet. Run{" "}
              <code className="text-amber-100">npm run db:institutions</code> to
              import U.S. universities.
            </li>
          )}

          {!needsBootstrap && query.trim().length < 2 && (
            <li className="px-3 py-3 text-xs text-zinc-500">
              Type at least 2 characters to search…
            </li>
          )}

          {!needsBootstrap && query.trim().length >= 2 && loading && (
            <li className="px-3 py-3 text-xs text-zinc-500">Searching…</li>
          )}

          {!needsBootstrap &&
            !loading &&
            query.trim().length >= 2 &&
            results.length === 0 && (
              <li className="px-3 py-3 text-xs text-zinc-500">
                No schools found. Try a different spelling.
              </li>
            )}

          {results.map((institution) => (
            <li key={institution.id} role="option">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                onClick={() => select(institution)}
              >
                <InstitutionLogoWithFallback
                  name={institution.name}
                  logoUrl={institution.logoUrl}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-100">
                    {institution.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {[institution.city, institution.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
