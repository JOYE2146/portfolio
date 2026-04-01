import type { PortfolioProject } from "./portfolio-project.types";
import raw from "./portfolio-projects.json" with { type: "json" };

const records = Array.isArray(raw) ? (raw as unknown as PortfolioProject[]) : [];

/** Raw JSON records (Firestore fallback + static CMS shape) */
export const portfolioProjectRecords: PortfolioProject[] = records;
