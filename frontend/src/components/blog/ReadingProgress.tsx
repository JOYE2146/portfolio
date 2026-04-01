import { cn } from "@/utils/cn";
import { useEffect, useState, type RefObject } from "react";

type ReadingProgressProps = {
  articleRef: RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * Top-of-viewport progress bar for long articles (scroll container = window).
 */
export function ReadingProgress({ articleRef, className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const update = () => {
      const rect = article.getBoundingClientRect();
      const scrollY = window.scrollY;
      const top = scrollY + rect.top;
      const height = article.offsetHeight;
      const vh = window.innerHeight;
      const end = top + height - vh;
      const start = top;
      const raw = (scrollY - start) / Math.max(1, end - start);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [articleRef]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 right-0 top-14 z-[60] h-[3px] bg-border/40 sm:top-[var(--space-header-h)]",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full origin-left bg-accent transition-[transform] duration-150 ease-out will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
