import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Single source of truth for honoring `prefers-reduced-motion` in our animation system.
 * Framer Motion subscribes to the same media query; we normalize to a strict boolean
 * so variant factories always receive a defined value.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() === true;
}
