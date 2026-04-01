import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** Narrow reading column vs full marketing width */
  variant?: "default" | "narrow";
} & HTMLAttributes<HTMLDivElement>;

const maxWidth: Record<NonNullable<ContainerProps["variant"]>, string> = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
};

/**
 * Horizontal padding + max-width shell. Mobile-first fluid width.
 */
export function Container({
  className,
  children,
  variant = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidth[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
