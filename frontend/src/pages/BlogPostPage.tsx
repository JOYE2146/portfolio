import { PostLayout } from "@/components/blog/PostLayout";
import { PostSEO } from "@/components/blog/PostSEO";
import { Container } from "@/components/layout/Container";
import { PageSeo } from "@/components/seo";
import { CONTACT_PROFILE } from "@/data/contact-profile";
import { getPostBySlug } from "@/data/blog/postRepository";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

const linkClass = cn(
  "font-semibold text-accent underline-offset-4 hover:underline",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
);

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const reducedMotion = useReducedMotion();
  const decoded = slug ? decodeURIComponent(slug) : "";
  const post = useMemo(
    () => (decoded ? getPostBySlug(decoded) : undefined),
    [decoded],
  );

  if (!post) {
    const slugPath = decoded ? `/blog/${encodeURIComponent(decoded)}` : "/blog";
    return (
      <>
        <PageSeo
          title={`Post not found · ${CONTACT_PROFILE.fullName}`}
          description="This blog post does not exist or was removed."
          path={slugPath}
          noindex
          includeCanonical={false}
        />
        <Container className="py-16">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-lg font-medium text-foreground">
              Post not found
            </p>
            <p className="mt-2 text-sm text-muted">
              The slug may be wrong or the post was removed from the content
              folder.
            </p>
            <Link
              to="/blog"
              className={cn(linkClass, "mt-6 inline-block text-sm")}
            >
              ← Back to blog
            </Link>
          </motion.div>
        </Container>
      </>
    );
  }

  return (
    <motion.div
      key={post.slug}
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <PostSEO post={post} />
      <PostLayout post={post} />
    </motion.div>
  );
}
