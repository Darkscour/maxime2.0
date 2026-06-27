"use client";

import { useEffect, useState } from "react";

/** True only after the component has mounted in the browser (never true during SSR). */
export function useClientMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
