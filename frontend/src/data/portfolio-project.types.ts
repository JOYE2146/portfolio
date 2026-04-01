/**
 * Canonical project shape for this portfolio (CMS / static JSON friendly).
 */
export type ProjectComplexity = "low" | "medium" | "high";

export type PerformanceMetric = {
  label: string;
  value: string;
};

/**
 * Layered architecture narrative + Mermaid for basic vs senior-level detail.
 * Use with {@link PortfolioProject.architectureCaseStudy}; legacy {@link PortfolioProject.architectureMermaid}
 * still maps to the basic diagram when no case study is present.
 */
export type ArchitectureCaseStudy = {
  /** High-level diagram (flowchart, simple C4) */
  diagramBasic: string;
  /** Deeper view: sequences, CI/CD, rules, caches, failure paths */
  diagramAdvanced?: string;
  /** Why Firebase vs SQL, serverless vs VMs, etc. */
  stackRationaleBasic: string;
  stackRationaleAdvanced?: string;
  /** Horizontal scaling, hot paths, sharding/partitioning ideas */
  scalabilityBasic: string;
  scalabilityAdvanced?: string;
  /** Concrete performance / cost tradeoffs */
  performanceDecisions?: string[];
  /** Pipelines, previews, deploy targets */
  cicdBasic?: string;
  cicdAdvanced?: string;
};

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
  /** Mermaid diagram when not using {@link architectureCaseStudy} */
  architectureMermaid?: string;
  /** Interactive basic/advanced architecture story */
  architectureCaseStudy?: ArchitectureCaseStudy;
  /** Bullet points for case-study page */
  challenges?: string[];
  /** KPIs / Lighthouse / bundle size, etc. */
  performanceMetrics?: PerformanceMetric[];
};

/** Catalog row: Firestore doc id or static JSON without id */
export type ProjectCatalogItem = PortfolioProject & { id?: string };
