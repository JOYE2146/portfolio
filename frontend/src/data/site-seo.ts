import { CONTACT_PROFILE } from "@/data/contact-profile";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";

export const SITE_TITLE_SUFFIX = CONTACT_PROFILE.fullName;

/** Default `<title>` before route-specific titles hydrate. */
export const SITE_HTML_TITLE = `${CONTACT_PROFILE.fullName} · Portfolio`;

export const SITE_DEFAULT_DESCRIPTION = CONTACT_PROFILE.tagline;

export const SITE_KEYWORDS = [
  CONTACT_PROFILE.fullName,
  "React",
  "TypeScript",
  "Firebase",
  "web developer",
  "full-stack",
  "network engineer",
  "portfolio",
  "Vite",
  "Tailwind CSS",
].join(", ");

/**
 * Optional full URL to a 1200×630 (or similar) social image.
 * Can be absolute or site-root path, e.g. `/og.png` placed in `public/`.
 */
export function getDefaultOgImageUrl(): string | undefined {
  const raw = import.meta.env.VITE_OG_IMAGE_URL?.trim();
  if (!raw) return undefined;
  if (raw.startsWith("https://") || raw.startsWith("http://")) return raw;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const origin = getSiteOrigin();
  return origin ? `${origin}${path}` : undefined;
}

export function resolveOgImageUrl(explicit?: string | null): string | undefined {
  if (explicit?.trim()) {
    const e = explicit.trim();
    if (e.startsWith("https://") || e.startsWith("http://")) return e;
    return absoluteUrl(e.startsWith("/") ? e : `/${e}`);
  }
  return getDefaultOgImageUrl();
}

export function getTwitterSiteHandle(): string | undefined {
  const h = import.meta.env.VITE_TWITTER_SITE?.trim();
  if (!h) return undefined;
  return h.startsWith("@") ? h : `@${h}`;
}
