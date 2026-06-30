"use client";

import { useCallback, useEffect, useRef } from "react";
import { isBenignFetchError } from "@/lib/benign-fetch-error";
import { fetchJson } from "@/lib/safe-json";

type Options = {
  /** Delay before the first request so SSR/navigation can settle. */
  initialDelayMs?: number;
  enabled?: boolean;
};

/**
 * Polls a JSON API route with abort-safe, non-overlapping requests.
 */
export function useAbortableIntervalFetch<T>(
  url: string,
  intervalMs: number,
  onData: (data: T) => void,
  options?: Options,
) {
  const onDataRef = useRef(onData);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);

  const load = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { ok, data } = await fetchJson<T>(url, { signal: controller.signal });
      if (!ok || !data) return;
      onDataRef.current(data);
    } catch (error) {
      if (isBenignFetchError(error)) return;
    } finally {
      inFlightRef.current = false;
    }
  }, [url]);

  useEffect(() => {
    if (options?.enabled === false) return;

    const initialDelayMs = options?.initialDelayMs ?? 400;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const timeoutId = window.setTimeout(() => {
      void load();
      intervalId = setInterval(() => {
        void load();
      }, intervalMs);
    }, initialDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      abortRef.current?.abort();
    };
  }, [intervalMs, load, options?.enabled, options?.initialDelayMs]);
}
