"use client";

import { useEffect } from "react";
import { isBenignFetchError } from "@/lib/benign-fetch-error";

function isBenignNavigationError(reason: unknown): boolean {
  return isBenignFetchError(reason);
}

/**
 * Suppresses dev-overlay noise from aborted RSC/fetch streams during redirects
 * (common in Firefox: TypeError "Error in input stream").
 */
export function BenignNavigationErrors() {
  useEffect(() => {
    function onUnhandledRejection(event: PromiseRejectionEvent) {
      if (isBenignNavigationError(event.reason)) {
        event.preventDefault();
      }
    }

    function onError(event: ErrorEvent) {
      if (isBenignNavigationError(event.error ?? event.message)) {
        event.preventDefault();
      }
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
    };
  }, []);

  return null;
}
