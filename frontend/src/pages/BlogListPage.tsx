import {
  createFadeUp,
  createStaggerContainer,
  defaultViewport,
} from "@/animations";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogIndexSEO } from "@/components/blog/PostSEO";
import { BlogSearchInput } from "@/components/blog/BlogSearchInput";
import { TagFilter } from "@/components/blog/TagFilter";
import { Container } from "@/components/layout/Container";
import { getAllPosts, getAllTags } from "@/data/blog/postRepository";
import type { ContentKind } from "@/data/blog/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type KindFilter = "all" | ContentKind;

const kindBtn = (active: boolean) =>
  cn(
    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    active
      ? "border-accent bg-accent/15 text-accent"
      : "border-border bg-elevated/40 text-muted hover:border-accent/25 hover:text-foreground"
  );

export function BlogListPage() {
  const reducedMotion = useReducedMotion();
  const posts = useMemo(() => getAllPosts(), []);
  const allTags = useMemo(() => getAllTags(), []);
  const [kind, setKind] = useState<KindFilter>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const headerFade = useMemo(() => createFadeUp(reducedMotion, { distance: 14 }), [reducedMotion]);
  const stagger = useMemo(
    () =>
      createStaggerContainer(reducedMotion, {
        stagger: 0.07,
        delayChildren: reducedMotion ? 0 : 0.05,
      }),
    [reducedMotion]
  );
  const cardFade = useMemo(() => createFadeUp(reducedMotion, { distance: 12 }), [reducedMotion]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (kind !== "all" && p.meta.type !== kind) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((t) => p.meta.tags.map((x) => x.toLowerCase()).includes(t.toLowerCase()))
      ) {
        return false;
      }
      if (q) {
        const blob = `${p.meta.title} ${p.meta.summary} ${p.body} ${p.meta.tags.join(" ")}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [posts, kind, selectedTags, query]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <>
      <BlogIndexSEO />
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Container className="py-10 sm:py-14">
          <motion.header
            className="mx-auto max-w-3xl text-center"
            variants={headerFade}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Writing</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Blog &amp; case studies
            </h1>
            <p className="mt-3 text-muted sm:text-lg">
              Concepts, tutorials, and optimizations—plus structured case studies with architecture,
              tradeoffs, and outcomes.
            </p>
            <p className="mt-4">
              <Link
                to="/"
                className="text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                ← Home
              </Link>
            </p>
          </motion.header>

          <motion.div
            className="mx-auto mt-10 max-w-3xl space-y-6"
            variants={headerFade}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <BlogSearchInput value={query} onChange={setQuery} />
            <div
              className="flex flex-wrap justify-center gap-2"
              role="tablist"
              aria-label="Content type"
            >
              {(
                [
                  ["all", "All"],
                  ["blog", "Articles"],
                  ["case-study", "Case studies"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={kind === key}
                  className={kindBtn(kind === key)}
                  onClick={() => setKind(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <TagFilter
              allTags={allTags}
              selected={selectedTags}
              onToggle={toggleTag}
              onClear={() => setSelectedTags([])}
            />
          </motion.div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">
            Showing <strong className="font-medium text-foreground">{filtered.length}</strong> of{" "}
            {posts.length} posts
          </p>

          {filtered.length === 0 ? (
            <p className="mx-auto mt-12 max-w-md text-center text-muted">
              No posts match your filters. Try clearing tags or search.
            </p>
          ) : (
            <motion.div
              className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
            >
              {filtered.map((post) => (
                <BlogCard key={post.slug} post={post} variants={cardFade} />
              ))}
            </motion.div>
          )}
        </Container>
      </motion.div>
    </>
  );
}
