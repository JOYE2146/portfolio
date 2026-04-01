import { MarkdownArticle } from "@/components/blog/MarkdownArticle";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Container } from "@/components/layout/Container";
import type { LoadedPost } from "@/data/blog/types";
import { buildTocFromMarkdown } from "@/data/blog/toc";
import { cn } from "@/utils/cn";
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";

const linkClass = cn(
  "text-sm font-semibold text-accent underline-offset-4 hover:underline",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

type PostLayoutProps = {
  post: LoadedPost;
};

export function PostLayout({ post }: PostLayoutProps) {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useMemo(() => buildTocFromMarkdown(post.body), [post.body]);
  const dateLabel = useMemo(() => {
    const d = new Date(post.meta.date);
    if (Number.isNaN(d.getTime())) return post.meta.date;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }, [post.meta.date]);

  return (
    <>
      <ReadingProgress articleRef={articleRef} />
      <Container className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb">
          <Link to="/blog" className={linkClass}>
            ← Blog
          </Link>
        </nav>

        <header className="mx-auto mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                post.meta.type === "case-study"
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border bg-elevated text-muted"
              )}
            >
              {post.meta.type === "case-study" ? "Case study" : "Article"}
            </span>
            {post.meta.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-background/60 px-2 py-0.5 text-xs text-muted"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.meta.title}
          </h1>
          <p className="mt-3 text-base text-muted">{post.meta.summary}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <time dateTime={post.meta.date}>{dateLabel}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTimeMinutes} min read</span>
            {post.meta.author ? (
              <>
                <span aria-hidden>·</span>
                <span>{post.meta.author}</span>
              </>
            ) : null}
          </p>
        </header>

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_240px]">
          <article
            ref={articleRef}
            className="min-w-0 border-t border-border pt-8 lg:border-t-0 lg:pt-0"
          >
            <MarkdownArticle markdown={post.body} />
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--space-header-h)+1rem)] space-y-6">
              <TableOfContents key={post.slug} items={toc} minItems={3} />
              {post.meta.type === "case-study" ? (
                <p className="text-xs leading-relaxed text-muted">
                  Case studies follow a fixed engineering narrative: problem → architecture → stack →
                  challenges → solutions → performance → outcomes.
                </p>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-8 max-w-3xl lg:hidden">
          <TableOfContents key={`${post.slug}-m`} items={toc} minItems={3} />
        </div>
      </Container>
    </>
  );
}
