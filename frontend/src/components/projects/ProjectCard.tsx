import { createHoverScale } from "@/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";

const linkClass = cn(
  "inline-flex items-center text-sm font-semibold text-accent underline-offset-4 hover:underline",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

export type ProjectCardProps = {
  title: string;
  description: string;
  tags?: readonly string[];
  /** Repository URL (opens in new tab) */
  href?: string;
  /** Deployed site — shown when set and distinct from placeholder domains */
  liveUrl?: string;
  featured?: boolean;
  complexity?: string;
  createdAt?: string;
  className?: string;
  variants?: Variants;
  footer?: ReactNode;
};

/**
 * Project tile: parent supplies stagger variants; hover uses transform-only scale + lift.
 * Repo and live links are separate anchors (no nested links).
 */
export function ProjectCard({
  title,
  description,
  tags,
  href,
  liveUrl,
  featured,
  complexity,
  createdAt,
  className,
  variants,
  footer,
}: ProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const hover = createHoverScale(reducedMotion, { scale: 1.02, lift: -4 });

  const hasLinks = Boolean(href?.trim()) || Boolean(liveUrl?.trim());

  const metaLine = [complexity ? `Complexity: ${complexity}` : null, createdAt ? formatCreated(createdAt) : null]
    .filter(Boolean)
    .join(" · ");

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
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          {featured ? (
            <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
              Featured
            </span>
          ) : null}
        </div>
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
        {metaLine ? <p className="mt-3 text-xs text-muted">{metaLine}</p> : null}
        {footer ? <div className="mt-4">{footer}</div> : null}
        {hasLinks ? (
          <div className="mt-auto flex flex-wrap gap-4 border-t border-border/80 pt-4">
            {href?.trim() ? (
              <a
                href={href.trim()}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Repository
              </a>
            ) : null}
            {liveUrl?.trim() ? (
              <a
                href={liveUrl.trim()}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Live site
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

function formatCreated(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `Added ${d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`;
  } catch {
    return "";
  }
}
