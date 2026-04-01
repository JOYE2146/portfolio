import { cn } from "@/utils/cn";

type BlogSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function BlogSearchInput({ value, onChange, className }: BlogSearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor="blog-search" className="sr-only">
        Search posts
      </label>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" strokeLinecap="round" />
        </svg>
      </span>
      <input
        id="blog-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search titles, summaries, tags, body…"
        autoComplete="off"
        className={cn(
          "w-full rounded-xl border border-border bg-elevated/60 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted",
          "focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/25"
        )}
      />
    </div>
  );
}
