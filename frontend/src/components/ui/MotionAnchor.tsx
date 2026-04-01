import { createHoverScale } from "@/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

type MotionAnchorProps = ComponentPropsWithoutRef<typeof motion.a> & {
  variant?: "primary" | "secondary";
};

const primaryClass = cn(
  "group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white",
  "shadow-[0_4px_24px_-4px_color-mix(in_oklch,var(--token-accent)_55%,transparent)]",
  "transition-[background-color,box-shadow] duration-300 hover:bg-accent-hover hover:shadow-[0_8px_32px_-6px_color-mix(in_oklch,var(--token-accent)_50%,transparent)]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

const secondaryClass = cn(
  "inline-flex items-center justify-center rounded-xl border border-border bg-elevated/80 px-6 py-3 text-sm font-semibold text-foreground",
  "shadow-sm backdrop-blur-sm transition-all duration-300",
  "hover:border-accent/40 hover:bg-accent/[0.06] hover:shadow-md",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

/**
 * Anchor with shared hover/tap motion (transform-only) — use for primary CTAs site-wide.
 */
export function MotionAnchor({
  variant = "primary",
  className,
  ...props
}: MotionAnchorProps) {
  const reducedMotion = useReducedMotion();
  const hover = createHoverScale(reducedMotion, { scale: 1.01, lift: -2 });

  return (
    <motion.a
      className={cn(variant === "primary" ? primaryClass : secondaryClass, className)}
      {...hover}
      {...props}
    />
  );
}
