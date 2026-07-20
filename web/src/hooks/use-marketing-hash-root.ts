"use client";

/** Hash/query base for marketing CTAs. */
export function useMarketingHashRoot() {
  return "/";
}

export function marketingHashHref(hashRoot: string, hash: string) {
  const normalized = hash.startsWith("#") ? hash : `#${hash}`;
  return hashRoot === "/" ? `/${normalized}` : `${hashRoot}${normalized}`;
}
