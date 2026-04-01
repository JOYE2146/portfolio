import type { ProjectCatalogItem } from "@/data/portfolio-project.types";
import { portfolioProjectRecords } from "@/data/projectGridSource";
import { findProjectBySegment } from "@/utils/project-slug";
import { fetchProjects } from "@/lib/firebase/projects";
import { useEffect, useState } from "react";

/**
 * Resolves one project by URL segment (Firestore id or title slug) using remote data or JSON fallback.
 */
export function useProjectDetail(segment: string | undefined) {
  const [project, setProject] = useState<ProjectCatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fallbackCatalog = (): ProjectCatalogItem[] => portfolioProjectRecords.map((r) => ({ ...r }));

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const remote = await fetchProjects();
        const base: ProjectCatalogItem[] = remote.length > 0 ? remote : fallbackCatalog();
        const found = findProjectBySegment(segment, base);
        if (!cancelled) {
          setProject(found ?? null);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load project");
          setProject(findProjectBySegment(segment, fallbackCatalog()) ?? null);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [segment]);

  return { project, loading, error };
}
