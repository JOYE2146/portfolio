/**
 * Centralized Framer Motion variants — opacity + transform only (no width/height animation).
 * Pair with `useReducedMotion` from `@/hooks/useReducedMotion` for accessibility.
 */
import type { Variants } from "framer-motion";
import { DURATION_FAST, EASE_OUT, createTransition } from "./transitions";

export type VariantOverrides = {
  /** Clamped to 0.2–0.5 when motion is enabled */
  duration?: number;
  delay?: number;
};

const DEFAULT_OFFSET = 20;

function itemTransition(
  reducedMotion: boolean,
  overrides: VariantOverrides | undefined,
  ease: readonly [number, number, number, number] = EASE_OUT
) {
  return createTransition(reducedMotion, {
    duration: overrides?.duration,
    delay: overrides?.delay,
    ease,
  });
}

/** Opacity only — lowest-cost entrance */
export function createFadeIn(
  reducedMotion: boolean,
  overrides?: VariantOverrides
): Variants {
  const t = itemTransition(reducedMotion, overrides);
  return {
    hidden: { opacity: reducedMotion ? 1 : 0 },
    visible: { opacity: 1, transition: t },
  };
}

/** Opacity + translateY (enter from below) */
export function createFadeUp(
  reducedMotion: boolean,
  overrides?: VariantOverrides & { distance?: number }
): Variants {
  const d = overrides?.distance ?? DEFAULT_OFFSET;
  const t = itemTransition(reducedMotion, overrides);
  return {
    hidden: {
      opacity: reducedMotion ? 1 : 0,
      y: reducedMotion ? 0 : d,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: t,
    },
  };
}

/** Opacity + translateY (enter from above) */
export function createFadeDown(
  reducedMotion: boolean,
  overrides?: VariantOverrides & { distance?: number }
): Variants {
  const d = overrides?.distance ?? DEFAULT_OFFSET;
  const t = itemTransition(reducedMotion, overrides);
  return {
    hidden: {
      opacity: reducedMotion ? 1 : 0,
      y: reducedMotion ? 0 : -d,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: t,
    },
  };
}

/** Opacity + translateX (enter from the left) */
export function createFadeLeft(
  reducedMotion: boolean,
  overrides?: VariantOverrides & { distance?: number }
): Variants {
  const d = overrides?.distance ?? DEFAULT_OFFSET;
  const t = itemTransition(reducedMotion, overrides);
  return {
    hidden: {
      opacity: reducedMotion ? 1 : 0,
      x: reducedMotion ? 0 : -d,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: t,
    },
  };
}

/** Opacity + translateX (enter from the right) */
export function createFadeRight(
  reducedMotion: boolean,
  overrides?: VariantOverrides & { distance?: number }
): Variants {
  const d = overrides?.distance ?? DEFAULT_OFFSET;
  const t = itemTransition(reducedMotion, overrides);
  return {
    hidden: {
      opacity: reducedMotion ? 1 : 0,
      x: reducedMotion ? 0 : d,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: t,
    },
  };
}

export type StaggerOptions = {
  /** Delay between each child (seconds) */
  stagger?: number;
  delayChildren?: number;
};

/**
 * Parent variant for lists/grids: staggers children that define their own `hidden` / `visible`.
 */
export function createStaggerContainer(
  reducedMotion: boolean,
  options: StaggerOptions = {}
): Variants {
  // Stagger is delay between children (seconds), not item duration — keep small for readability
  const stagger = reducedMotion ? 0 : Math.min(0.12, Math.max(0.03, options.stagger ?? 0.06));
  const delayChildren = reducedMotion ? 0 : (options.delayChildren ?? 0);
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };
}

/**
 * Nested stagger (e.g. tech badges inside an already-staggered column).
 */
export function createStaggerInner(
  reducedMotion: boolean,
  options: StaggerOptions = {}
): Variants {
  return createStaggerContainer(reducedMotion, {
    stagger: options.stagger ?? 0.045,
    delayChildren: options.delayChildren ?? 0,
  });
}

export type HoverScaleOptions = {
  /** Slight scale on hover — keep near 1 for professional UI */
  scale?: number;
  /** Negative = lift (translateY, transform) */
  lift?: number;
};

/**
 * Interactive feedback for buttons/cards — transform + opacity-safe scale only.
 * Spread onto `motion.button` / `motion.a` as props.
 */
export function createHoverScale(
  reducedMotion: boolean,
  options: HoverScaleOptions = {}
) {
  if (reducedMotion) {
    return {};
  }
  const scale = options.scale ?? 1.02;
  const lift = options.lift ?? 0;
  return {
    whileHover: {
      scale,
      y: lift,
      transition: { duration: DURATION_FAST, ease: EASE_OUT },
    },
    whileTap: {
      scale: 0.98,
      transition: { duration: DURATION_FAST, ease: EASE_OUT },
    },
  };
}
