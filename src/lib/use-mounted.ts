"use client";

import { useEffect, useState } from "react";

/** Returns true only after the component has mounted on the client.
 *  Useful to avoid hydration mismatches for persisted/localStorage state. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
