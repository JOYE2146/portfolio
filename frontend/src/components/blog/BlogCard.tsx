import { createHoverScale } from "@/animations";
import type { LoadedPost } from "@/data/blog/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";

type BlogCardProps = {
  post: LoadedPost;
  variants?: Variants;
};

export function BlogCard({ post, variants }: BlogCardProps) {
  const reducedMotion = useReducedMotion();
  const hover = createHoverScale(reducedMotion, { scale: 1.01, lift: -2 });
  const dateShort = new Date(post.meta.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.article
      variants={variants}
      className="h-full"
      {...hover}
    >
      <Link
        to={`/blog/${encodeURIComponent(post.slug)}`}
        className={cn(
          "flex h-full flex-col rounded-2xl border border-border bg-elevated/40 p-5 shadow-sm transition-colors",
          "hover:border-accent/30 hover:bg-elevated/70",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide",
              post.meta.type === "case-study"
                ? "bg-accent/15 text-accent"
                : "bg-border/60 text-muted"
            )}
          >
            {post.meta.type === "case-study" ? "Case study" : "Article"}
          </span>
          <time className="text-xs text-muted" dateTime={post.meta.date}>
            {dateShort}
          </time>
          <span className="text-xs text-muted">{post.readingTimeMinutes} min read</span>
        </div>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{post.meta.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.meta.summary}</p>
        <ul className="mt-4 flex list-none flex-wrap gap-1.5 p-0" aria-label="Tags">
          {post.meta.tags.slice(0, 5).map((t) => (
            <li
              key={t}
              className="rounded-md border border-border/80 bg-background/50 px-2 py-0.5 text-[0.7rem] text-muted"
            >
              {t}
            </li>
          ))}
        </ul>
      </Link>
    </motion.article>
  );
}
