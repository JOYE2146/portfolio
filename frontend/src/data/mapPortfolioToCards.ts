import type { PortfolioProject } from "./portfolio-project.types";
import type { ProjectCardProps } from "@/components/projects/ProjectCard";

const PLACEHOLDER_LIVE = /your-site\.com|^$/i;

function normalizeRepoUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  return t.replace(/\.git\/?$/i, "");
}

/** Show live link only when URL is set and not the template placeholder */
function showLiveLink(liveUrl: string): boolean {
  return Boolean(liveUrl.trim()) && !PLACEHOLDER_LIVE.test(liveUrl.trim());
}

/**
 * Maps stored project records into props for `ProjectCard`.
 * Primary CTA: repo when present; otherwise card is static (no outer link).
 */
export function mapPortfolioProjectToCard(
  p: PortfolioProject
): Omit<ProjectCardProps, "variants"> {
  const repo = normalizeRepoUrl(p.repoUrl);

  return {
    title: p.title,
    description: p.description,
    tags: p.tech,
    href: repo || undefined,
    featured: p.featured,
    liveUrl: showLiveLink(p.liveUrl) ? p.liveUrl.trim() : undefined,
    complexity: p.complexity,
    createdAt: p.createdAt,
  };
}
