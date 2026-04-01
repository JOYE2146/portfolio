import { useTheme } from "@/hooks/theme";
import { cn } from "@/utils/cn";
import { useEffect, useId, useRef, useState } from "react";

type MermaidBlockProps = {
  chart: string;
  className?: string;
};

function shortHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

/**
 * Renders Mermaid source to SVG (client-only). Theme follows app light/dark.
 */
export function MermaidBlock({ chart, className }: MermaidBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const source = chart.trim();
    if (!source) return;

    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        });
        const { svg } = await mermaid.render(
          `mm-${reactId}-${resolvedTheme}-${shortHash(source)}`,
          source
        );
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not render diagram");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId, resolvedTheme]);

  if (!chart.trim()) return null;

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-200",
          className
        )}
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "min-h-[120px] overflow-x-auto rounded-xl border border-border bg-background/60 p-4",
        "[&_svg]:mx-auto [&_svg]:max-h-[480px] [&_svg]:max-w-full [&_svg]:h-auto",
        className
      )}
      aria-label="Architecture diagram"
    />
  );
}
