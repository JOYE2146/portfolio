import { MermaidBlock } from "@/components/projects/MermaidBlock";
import type { ArchitectureCaseStudy } from "@/data/portfolio-project.types";
import { cn } from "@/utils/cn";
import {
  architectureHasAdvancedLayer,
  pickArchitectureLayer,
} from "@/utils/architecture-study";
import { AnimatePresence, motion } from "framer-motion";
import { useId, useMemo, useState, type ReactNode } from "react";

type Layer = "basic" | "advanced";

type InteractiveArchitectureStudyProps = {
  study: ArchitectureCaseStudy;
  /** Smaller type and tighter spacing for home section cards */
  compact?: boolean;
  className?: string;
};

const panelMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionCard({
  title,
  children,
  compact,
}: {
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  if (children == null || children === false) return null;
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-elevated/40 p-4 shadow-sm",
        compact && "p-3 sm:p-4"
      )}
    >
      <h3
        className={cn(
          "font-semibold tracking-tight text-foreground",
          compact ? "text-sm" : "text-base"
        )}
      >
        {title}
      </h3>
      <div className={cn("mt-2 text-muted", compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed")}>
        {children}
      </div>
    </div>
  );
}

export function InteractiveArchitectureStudy({
  study,
  compact,
  className,
}: InteractiveArchitectureStudyProps) {
  const baseId = useId().replace(/:/g, "");
  const showToggle = architectureHasAdvancedLayer(study);
  const [layer, setLayer] = useState<Layer>("basic");

  const chart = useMemo(() => {
    const adv = study.diagramAdvanced?.trim();
    if (layer === "advanced" && adv) return adv;
    return study.diagramBasic.trim();
  }, [layer, study.diagramAdvanced, study.diagramBasic]);

  const stack = pickArchitectureLayer(layer, study.stackRationaleBasic, study.stackRationaleAdvanced);
  const scale = pickArchitectureLayer(layer, study.scalabilityBasic, study.scalabilityAdvanced);
  const cicd = pickArchitectureLayer(layer, study.cicdBasic, study.cicdAdvanced);
  const perf = study.performanceDecisions ?? [];

  return (
    <div className={cn("space-y-6", className)}>
      {showToggle ? (
        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          role="group"
          aria-label="Diagram detail level"
        >
          <p className={cn("text-muted", compact ? "text-xs" : "text-sm")}>
            Toggle between a quick overview and a deeper systems view.
          </p>
          <div
            className="inline-flex rounded-lg border border-border bg-background/80 p-1"
            role="tablist"
          >
            {(["basic", "advanced"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`${baseId}-${key}`}
                aria-selected={layer === key}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  layer === key
                    ? "bg-accent/15 text-accent shadow-sm"
                    : "text-muted hover:text-foreground"
                )}
                onClick={() => setLayer(key)}
              >
                {key === "basic" ? "Basic" : "Advanced"}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div key={`${layer}-${chart.length}-${chart.slice(0, 24)}`} {...panelMotion}>
          <MermaidBlock chart={chart} />
        </motion.div>
      </AnimatePresence>

      <div
        className={cn(
          "grid gap-4",
          compact ? "sm:grid-cols-1 lg:grid-cols-2" : "lg:grid-cols-2"
        )}
      >
        <AnimatePresence mode="wait">
          {stack ? (
            <motion.div key={`stack-${layer}`} {...panelMotion} className="min-w-0">
              <SectionCard title="Why this architecture" compact={compact}>
                <p>{stack}</p>
              </SectionCard>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {scale ? (
            <motion.div key={`scale-${layer}`} {...panelMotion} className="min-w-0">
              <SectionCard title="Scalability strategy" compact={compact}>
                <p>{scale}</p>
              </SectionCard>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {cicd ? (
            <motion.div key={`cicd-${layer}`} {...panelMotion} className="min-w-0">
              <SectionCard title="CI / CD & delivery" compact={compact}>
                <p>{cicd}</p>
              </SectionCard>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {perf.length > 0 ? (
          <SectionCard title="Key performance decisions" compact={compact}>
            <ul className="list-disc space-y-1.5 pl-4 text-foreground/90">
              {perf.map((line: string) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </SectionCard>
        ) : null}
      </div>
    </div>
  );
}
