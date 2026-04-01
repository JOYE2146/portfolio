import { cn } from "@/utils/cn";

type TagFilterProps = {
  allTags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
};

export function TagFilter({ allTags, selected, onToggle, onClear }: TagFilterProps) {
  if (allTags.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Tags</span>
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-accent underline-offset-2 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
        {allTags.map((tag) => {
          const on = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(tag)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                on
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-elevated/50 text-muted hover:border-accent/30 hover:text-foreground"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
