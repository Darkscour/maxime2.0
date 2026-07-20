"use client";

import { useEffect } from "react";
import type { AuthIntent } from "@/lib/auth-intent";

function tuneAuthInputs(root: Element, intent: AuthIntent) {
  const inputs = root.querySelectorAll<HTMLInputElement>("input");

  inputs.forEach((input) => {
    const fieldId =
      input.name ||
      input.id ||
      input.getAttribute("data-testid") ||
      input.getAttribute("aria-label") ||
      "";

    if (input.type === "email" || fieldId.includes("email")) {
      input.autocomplete = intent === "sign-in" ? "username" : "email";
      return;
    }

    if (input.type === "password" || fieldId.includes("password")) {
      input.autocomplete = intent === "sign-in" ? "current-password" : "new-password";

      if (intent === "sign-up" && input.dataset.authTuned !== "true") {
        input.dataset.authTuned = "true";
        input.setAttribute("readonly", "true");
        input.addEventListener(
          "focus",
          () => {
            input.removeAttribute("readonly");
          },
          { once: true },
        );
      }
      return;
    }

    if (fieldId.includes("first") || fieldId.includes("given")) {
      input.autocomplete = "given-name";
      return;
    }

    if (fieldId.includes("last") || fieldId.includes("family")) {
      input.autocomplete = "family-name";
    }
  });
}

/**
 * Aligns Clerk inputs with sign-in vs sign-up autofill semantics so browsers
 * don't drop saved login passwords into registration fields.
 */
export function AuthClerkInputTuning({
  intent,
  children,
}: {
  intent: AuthIntent;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.querySelector(".auth-clerk-host");
    if (!root) return;

    tuneAuthInputs(root, intent);

    const observer = new MutationObserver(() => {
      tuneAuthInputs(root, intent);
    });

    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [intent]);

  return <>{children}</>;
}
