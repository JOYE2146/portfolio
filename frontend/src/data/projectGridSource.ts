import type { PortfolioProject } from "./portfolio-project.types";
import { mapPortfolioProjectToCard } from "./mapPortfolioToCards";
import raw from "./portfolio-projects.json" with { type: "json" };

const records = raw as unknown as PortfolioProject[];

/** Normalized rows for `ProjectGrid` / `ProjectCard` */
export const projectGridItems = records.map(mapPortfolioProjectToCard);

/** Raw JSON records (e.g. future CMS or static site generation) */
export const portfolioProjectRecords = records;
