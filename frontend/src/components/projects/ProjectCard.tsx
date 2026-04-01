import { createHoverScale } from "@/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";

export type ProjectCardProps = {
  title: string;
  description: string;
  tags?: readonly string[];
  href?: string;
  className?: string;
  variants?: Variants;
  footer?: ReactNode;
};

/**
 * Project tile: parent supplies stagger variants; hover uses transform-only scale + lift.
 */
export function ProjectCard({
  title,
  description,
  tags,
  href,
  className,
  variants,
  footer,
}: ProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const hover = createHoverScale(reducedMotion, { scale: 1.02, lift: -4 });

  const content = (
    <>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      {tags && tags.length > 0 ? (
        <ul className="mt-4 flex list-none flex-wrap gap-2 p-0" aria-label="Technologies">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border bg-background/80 px-2 py-0.5 text-xs font-medium text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </>
  );

  return (
    <motion.article
      variants={variants}
      className={cn(
        "relative flex h-full flex-col rounded-xl border border-border bg-elevated/60 p-5 shadow-sm backdrop-blur-sm",
        "ring-1 ring-black/[0.03] transition-[border-color,box-shadow] duration-300 dark:ring-white/[0.05]",
        "hover:border-accent/25 hover:shadow-md",
        className
      )}
      {...hover}
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "flex flex-1 flex-col text-inherit no-underline outline-none",
            "focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          )}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </motion.article>
  );
}
