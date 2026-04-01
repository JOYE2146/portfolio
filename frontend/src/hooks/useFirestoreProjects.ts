import type { PortfolioProject, ProjectCatalogItem } from "@/data/portfolio-project.types";
import { PROJECTS_UPDATED_EVENT } from "@/lib/firebase/project-events";
import { fetchProjects, type FirestoreProject } from "@/lib/firebase/projects";
import { useEffect, useState } from "react";

const EMPTY_FALLBACK: PortfolioProject[] = [];
const EMPTY_CATALOG: ProjectCatalogItem[] = [];

/**
 * Loads `projects` from Firestore on mount. On empty collection, error, or missing config,
 * uses `fallbackRecords` (e.g. JSON). Returns full `catalog` for filters + detail pages.
 */
export function useFirestoreProjects(fallbackRecords: PortfolioProject[] | undefined) {
  const fallback = fallbackRecords ?? EMPTY_FALLBACK;
  const [catalog, setCatalog] = useState<ProjectCatalogItem[]>(() => fallback.map((r) => ({ ...r })));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const bump = () => setReloadTick((n) => n + 1);
    window.addEventListener(PROJECTS_UPDATED_EVENT, bump);
    return () => window.removeEventListener(PROJECTS_UPDATED_EVENT, bump);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const applyFallback = () => fallback.map((r) => ({ ...r }));

    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setError(null);

      try {
        const rows: FirestoreProject[] = await fetchProjects();
        if (cancelled) return;
        setCatalog(rows.length > 0 ? rows : applyFallback());
        setLoading(false);
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Could not load projects";
        setError(message);
        setCatalog(applyFallback());
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fallback, reloadTick]);

  return { catalog: catalog ?? EMPTY_CATALOG, loading, error };
}
