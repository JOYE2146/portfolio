import type { Transition } from "framer-motion";

/**
 * Durations stay within 0.2s–0.5s for UI entrances (GPU-friendly opacity + transform).
 */
export const DURATION_FAST = 0.2;
export const DURATION_NORMAL = 0.35;
export const DURATION_SLOW = 0.5;

/** Smooth deceleration — ideal for elements settling into place */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Balanced start/end — use for subtle symmetric motion */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export function clampDuration(seconds: number): number {
  return Math.min(DURATION_SLOW, Math.max(DURATION_FAST, seconds));
}

export type MotionTransitionOptions = {
  duration?: number;
  delay?: number;
  ease?: readonly [number, number, number, number];
};

/**
 * Builds a Framer Motion transition; collapses to instant when reduced motion is preferred.
 */
export function createTransition(
  reducedMotion: boolean,
  options: MotionTransitionOptions = {}
): Transition {
  if (reducedMotion) {
    return { duration: 0 };
  }
  return {
    duration: clampDuration(options.duration ?? DURATION_NORMAL),
    delay: options.delay ?? 0,
    ease: (options.ease ?? EASE_OUT) as [number, number, number, number],
  };
}

/**
 * whileInView defaults: fire once, slightly before the element is fully on screen (margin),
 * so entrances feel timed to scroll rather than late pops.
 */
export const defaultViewport = {
  once: true,
  margin: "-64px 0px -48px 0px",
  amount: 0.15,
} as const;
