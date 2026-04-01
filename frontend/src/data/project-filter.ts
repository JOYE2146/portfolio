import type { ProjectCatalogItem, ProjectComplexity } from "@/data/portfolio-project.types";

export type SortMode = "featured" | "date" | "title" | "complexity";

export function collectAllTech(catalog: ProjectCatalogItem[]): string[] {
  const set = new Set<string>();
  for (const p of catalog) {
    for (const t of p.tech) {
      if (t.trim()) set.add(t.trim());
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export function filterCatalogByTechAndComplexity(
  catalog: ProjectCatalogItem[],
  selectedTech: string[],
  complexity: "all" | ProjectComplexity
): ProjectCatalogItem[] {
  let out = catalog;
  if (selectedTech.length > 0) {
    const want = selectedTech.map((t) => t.toLowerCase());
    out = out.filter((p) =>
      want.some((t) =>
        p.tech.some((pt) => pt.toLowerCase() === t || pt.toLowerCase().includes(t))
      )
    );
  }
  if (complexity !== "all") {
    out = out.filter((p) => p.complexity === complexity);
  }
  return out;
}

const complexityRank: Record<ProjectComplexity, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export function sortCatalog(catalog: ProjectCatalogItem[], mode: SortMode): ProjectCatalogItem[] {
  const out = [...catalog];
  switch (mode) {
    case "featured":
      out.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    case "date":
      out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "title":
      out.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
      break;
    case "complexity":
      out.sort((a, b) => complexityRank[a.complexity] - complexityRank[b.complexity]);
      break;
    default:
      break;
  }
  return out;
}
