import {
  getDefaultOgImageUrl,
  getTwitterSiteHandle,
  resolveOgImageUrl,
  SITE_DEFAULT_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE_SUFFIX,
} from "@/data/site-seo";
import { absoluteUrl } from "@/lib/site-url";
import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";

export type PageSeoProps = {
  /** Full page title (include branding if you want it in the tab). */
  title: string;
  description?: string;
  /** Path only, e.g. `/blog` — builds canonical & og:url */
  path: string;
  noindex?: boolean;
  ogType?: "website" | "article" | "profile";
  /** Overrides default env OG image for this page */
  ogImage?: string | null;
  /** Extra JSON-LD objects (serialized as separate script tags) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Set false for soft 404 / utility routes where a single canonical URL would be misleading */
  includeCanonical?: boolean;
  children?: ReactNode;
};

export function PageSeo({
  title,
  description = SITE_DEFAULT_DESCRIPTION,
  path,
  noindex = false,
  ogType = "website",
  ogImage,
  jsonLd,
  includeCanonical = true,
  children,
}: PageSeoProps) {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = absoluteUrl(canonicalPath);
  const image = resolveOgImageUrl(ogImage ?? undefined) ?? getDefaultOgImageUrl();
  const largeImage = Boolean(image);
  const twitterSite = getTwitterSiteHandle();

  const ldNodes: Record<string, unknown>[] = !jsonLd
    ? []
    : Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd];

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={SITE_KEYWORDS} />
      <meta name="author" content={SITE_TITLE_SUFFIX} />
      {includeCanonical ? <link rel="canonical" href={canonical} /> : null}

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      <meta property="og:site_name" content={SITE_TITLE_SUFFIX} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {includeCanonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:locale" content="en_US" />
      {image ? <meta property="og:image" content={image} /> : null}
      {image ? <meta property="og:image:alt" content={title} /> : null}

      <meta
        name="twitter:card"
        content={largeImage ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {twitterSite ? <meta name="twitter:site" content={twitterSite} /> : null}
      {image ? <meta name="twitter:image" content={image} /> : null}

      {ldNodes.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      {children}
    </Helmet>
  );
}
