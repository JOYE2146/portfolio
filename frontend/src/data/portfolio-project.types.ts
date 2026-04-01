/**
 * Canonical project shape for this portfolio (CMS / static JSON friendly).
 */
export type ProjectComplexity = "low" | "medium" | "high";

export type PortfolioProject = {
  title: string;
  description: string;
  tech: string[];
  liveUrl: string;
  repoUrl: string;
  /** Asset paths or URLs — optional until you add screenshots */
  images: string[];
  featured: boolean;
  complexity: ProjectComplexity;
  /** ISO 8601 timestamp */
  createdAt: string;
};
