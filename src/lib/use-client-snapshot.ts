"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Lit une valeur client-only (sessionStorage, etc.) sans provoquer de
 * mismatch d'hydratation : le serveur et le premier rendu client
 * utilisent tous les deux `serverSnapshot`, puis React re-rend avec la
 * vraie valeur juste après l'hydratation.
 */
export function useClientSnapshot<T>(getSnapshot: () => T, serverSnapshot: T): T {
  return useSyncExternalStore(noopSubscribe, getSnapshot, () => serverSnapshot);
}
