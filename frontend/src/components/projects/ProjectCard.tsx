import { createHoverScale } from "@/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

const linkClass = cn(
  "inline-flex items-center text-sm font-semibold text-accent underline-offset-4 hover:underline",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

export type ProjectCardProps = {
  title: string;
  description: string;
  tags?: readonly string[];
  /** HTTPS image URLs (e.g. from Firestore or CDN) */
  images?: readonly string[];
  /** Repository URL (opens in new tab) */
  href?: string;
  /** Deployed site — shown when set and distinct from placeholder domains */
  liveUrl?: string;
  /** Path segment for `/projects/:projectId` */
  detailSegment?: string;
  featured?: boolean;
  complexity?: string;
  createdAt?: string;
  className?: string;
  variants?: Variants;
  footer?: ReactNode;
};

const MAX_GALLERY = 4;

/**
 * Dynamic project tile: optional cover + gallery, tech tags, links.
 */
export function ProjectCard({
  title,
  description,
  tags,
  images = [],
  href,
  liveUrl,
  detailSegment,
  featured,
  complexity,
  createdAt,
  className,
  variants,
  footer,
}: ProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const hover = createHoverScale(reducedMotion, { scale: 1.02, lift: -4 });
  const [coverFailed, setCoverFailed] = useState(false);

  const hasLinks = Boolean(href?.trim()) || Boolean(liveUrl?.trim());
  const cover = images[0];
  const gallery = images.slice(1, MAX_GALLERY);
  const showCover = Boolean(cover) && !coverFailed;

  const metaLine = [complexity ? `Complexity: ${complexity}` : null, createdAt ? formatCreated(createdAt) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <motion.article
      variants={variants}
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-elevated/60 shadow-sm backdrop-blur-sm",
        "ring-1 ring-black/[0.03] transition-[border-color,box-shadow] duration-300 dark:ring-white/[0.05]",
        "hover:border-accent/25 hover:shadow-md",
        className
      )}
      {...hover}
    >
      {showCover ? (
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-border/40">
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setCoverFailed(true)}
          />
          {featured ? (
            <span className="absolute right-2 top-2 rounded-full border border-accent/40 bg-background/90 px-2 py-0.5 text-xs font-semibold text-accent backdrop-blur-sm">
              Featured
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={cn("flex flex-1 flex-col p-5", !showCover && featured ? "pt-5" : "")}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          {!showCover && featured ? (
            <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
              Featured
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

        {gallery.length > 0 ? (
          <ul
            className="mt-3 flex list-none gap-2 overflow-x-auto p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="More screenshots"
          >
            {gallery.map((src, i) => (
              <li
                key={`${src}-${i}`}
                className="h-14 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30"
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        ) : null}

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
        {detailSegment ? (
          <div className="mt-4">
            <Link
              to={`/projects/${detailSegment}`}
              className={cn(linkClass, "text-sm")}
            >
              Case study →
            </Link>
          </div>
        ) : null}
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
