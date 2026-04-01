import type { ProjectCatalogItem } from "@/data/portfolio-project.types";

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL path segment: prefer Firestore id, else slug from title */
export function getDetailSegment(project: ProjectCatalogItem): string {
  const id = project.id?.trim();
  if (id) return id;
  return slugifyTitle(project.title);
}

export function findProjectBySegment(
  segment: string | undefined,
  catalog: ProjectCatalogItem[]
): ProjectCatalogItem | undefined {
  if (!segment) return undefined;
  let raw = segment;
  try {
    raw = decodeURIComponent(segment);
  } catch {
    raw = segment;
  }
  return catalog.find((p) => {
    if (p.id && p.id === raw) return true;
    return slugifyTitle(p.title) === raw;
  });
}
