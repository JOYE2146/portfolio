import { cn } from "@/utils/cn";
import type { TocItem } from "@/data/blog/types";
import { useEffect, useState } from "react";

type TableOfContentsProps = {
  items: TocItem[];
  /** Only show when at least this many headings */
  minItems?: number;
  className?: string;
};

export function TableOfContents({ items, minItems = 3, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(() => items[0]?.id ?? null);

  useEffect(() => {
    if (items.length < minItems) return;
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] }
    );
    for (const el of els) obs.observe(el);
    return () => obs.disconnect();
  }, [items, minItems]);

  if (items.length < minItems) return null;

  return (
    <nav
      className={cn(
        "rounded-xl border border-border bg-elevated/50 p-4 text-sm backdrop-blur-sm",
        className
      )}
      aria-label="On this page"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">On this page</p>
      <ul className="mt-3 flex flex-col gap-1.5" role="list">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.depth === 3 ? "0.75rem" : 0 }}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block rounded-md py-0.5 text-muted transition-colors hover:text-accent",
                activeId === item.id && "font-medium text-accent"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
