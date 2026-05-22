import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — combine Tailwind class strings safely.
 *
 * Why this exists:
 *   When you compose components, you often pass extra classes via props. If
 *   you naively join them you get duplicates like "p-2 p-4" and the wrong
 *   one wins. `twMerge` resolves Tailwind conflicts (later wins) and `clsx`
 *   handles conditional inputs like booleans, arrays, and objects.
 *
 * Example:
 *   cn("p-2 text-zinc-300", isActive && "text-cyan-400", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
