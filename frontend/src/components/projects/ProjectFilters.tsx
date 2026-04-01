import type { ProjectComplexity } from "@/data/portfolio-project.types";
import type { SortMode } from "@/data/project-filter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

type ProjectFiltersProps = {
  allTech: string[];
  selectedTech: string[];
  onTechToggle: (tech: string) => void;
  complexity: "all" | ProjectComplexity;
  onComplexityChange: (v: "all" | ProjectComplexity) => void;
  sort: SortMode;
  onSortChange: (v: SortMode) => void;
  onReset: () => void;
  className?: string;
};

export function ProjectFilters({
  allTech,
  selectedTech,
  onTechToggle,
  complexity,
  onComplexityChange,
  sort,
  onSortChange,
  onReset,
  className,
}: ProjectFiltersProps) {
  const reducedMotion = useReducedMotion();
  const hasFilters = selectedTech.length > 0 || complexity !== "all";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-elevated/50 p-4 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Filter &amp; sort</h3>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters && sort === "featured"}
          className={cn(
            "text-xs font-medium text-accent underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40",
            "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          )}
        >
          Reset
        </button>
      </div>

      <fieldset className="mt-4">
        <legend className="text-xs font-medium uppercase tracking-wide text-muted">Technologies</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {allTech.length === 0 ? (
            <span className="text-xs text-muted">No tags in current list</span>
          ) : (
            allTech.map((t) => {
              const on = selectedTech.includes(t);
              return (
                <motion.button
                  key={t}
                  type="button"
                  onClick={() => onTechToggle(t)}
                  aria-pressed={on}
                  whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    on
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-background/80 text-muted hover:border-accent/35"
                  )}
                >
                  {t}
                </motion.button>
              );
            })
          )}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted">
          Complexity
          <select
            value={complexity}
            onChange={(e) => onComplexityChange(e.target.value as "all" | ProjectComplexity)}
            className={cn(
              "min-w-[9rem] rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-normal text-foreground",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            )}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted">
          Sort by
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortMode)}
            className={cn(
              "min-w-[11rem] rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-normal text-foreground",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            )}
          >
            <option value="featured">Featured first</option>
            <option value="date">Newest</option>
            <option value="title">Title (A–Z)</option>
            <option value="complexity">Complexity (low → high)</option>
          </select>
        </label>
      </div>
    </div>
  );
}
