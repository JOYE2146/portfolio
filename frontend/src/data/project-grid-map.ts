import type { ProjectGridItem } from "@/components/projects/ProjectGrid";
import type { ProjectCatalogItem } from "@/data/portfolio-project.types";
import { mapPortfolioProjectToCard } from "@/data/mapPortfolioToCards";
import { getDetailSegment } from "@/utils/project-slug";

export function catalogItemToGridItem(project: ProjectCatalogItem): ProjectGridItem {
  return {
    id: project.id,
    detailSegment: getDetailSegment(project),
    ...mapPortfolioProjectToCard(project),
  };
}
