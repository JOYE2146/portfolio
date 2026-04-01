import type { LoadedPost } from "@/data/blog/types";
import { getDefaultOgImageUrl, getTwitterSiteHandle } from "@/data/site-seo";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";
import { Helmet } from "react-helmet-async";

type PostSEOProps = {
  post: LoadedPost;
};

export function PostSEO({ post }: PostSEOProps) {
  const origin = getSiteOrigin();
  const url = `${origin}/blog/${encodeURIComponent(post.slug)}`;
  const author = post.meta.author ?? "Yoseph";
  const image = getDefaultOgImageUrl();
  const twitterSite = getTwitterSiteHandle();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": post.meta.type === "case-study" ? "TechArticle" : "BlogPosting",
    headline: post.meta.title,
    description: post.meta.summary,
    datePublished: post.meta.date,
    author: {
      "@type": "Person",
      name: author,
    },
    keywords: post.meta.tags.join(", "),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <Helmet prioritizeSeoTags>
      <title>{post.meta.title} · Blog</title>
      <meta name="description" content={post.meta.summary} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.meta.title} />
      <meta property="og:description" content={post.meta.summary} />
      <meta property="og:url" content={url} />
      {image ? <meta property="og:image" content={image} /> : null}
      {image ? <meta property="og:image:alt" content={post.meta.title} /> : null}
      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={post.meta.title} />
      <meta name="twitter:description" content={post.meta.summary} />
      {twitterSite ? <meta name="twitter:site" content={twitterSite} /> : null}
      {image ? <meta name="twitter:image" content={image} /> : null}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

type BlogIndexSEOProps = {
  title?: string;
  description?: string;
};

export function BlogIndexSEO({
  title = "Blog · Technical writing & case studies",
  description = "Tutorials, performance notes, and real-world case studies on React, Firebase, and system design.",
}: BlogIndexSEOProps) {
  const url = absoluteUrl("/blog");
  const image = getDefaultOgImageUrl();
  const twitterSite = getTwitterSiteHandle();

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image ? <meta property="og:image" content={image} /> : null}
      {image ? <meta property="og:image:alt" content={title} /> : null}
      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {twitterSite ? <meta name="twitter:site" content={twitterSite} /> : null}
      {image ? <meta name="twitter:image" content={image} /> : null}
    </Helmet>
  );
}
