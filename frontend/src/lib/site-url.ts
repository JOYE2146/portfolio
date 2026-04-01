/**
 * Canonical origin for SEO, Open Graph, and analytics. Set `VITE_PUBLIC_SITE_URL`
 * in production (no trailing slash), e.g. https://yosephbedasa.dev
 */
export function getSiteOrigin(): string {
  const env = import.meta.env.VITE_PUBLIC_SITE_URL;
  if (typeof env === "string" && env.trim()) {
    return env.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

/** Absolute URL for a path starting with `/`. */
export function absoluteUrl(path: string): string {
  const origin = getSiteOrigin();
  const p = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${p}` : p;
}
