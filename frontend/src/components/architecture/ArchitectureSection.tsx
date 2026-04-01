import {
  createFadeUp,
  createStaggerContainer,
  defaultViewport,
} from "@/animations";
import { InteractiveArchitectureStudy } from "@/components/architecture/InteractiveArchitectureStudy";
import { Container } from "@/components/layout/Container";
import type { ProjectCatalogItem } from "@/data/portfolio-project.types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getDetailSegment } from "@/utils/project-slug";
import {
  projectHasArchitectureContent,
  resolveArchitectureStudy,
} from "@/utils/architecture-study";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const linkClass = cn(
  "text-sm font-semibold text-accent underline-offset-4 hover:underline",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

type ArchitectureSectionProps = {
  catalog: ProjectCatalogItem[];
};

export function ArchitectureSection({ catalog }: ArchitectureSectionProps) {
  const reducedMotion = useReducedMotion();
  const headerFade = useMemo(() => createFadeUp(reducedMotion, { distance: 14 }), [reducedMotion]);
  const stagger = useMemo(
    () =>
      createStaggerContainer(reducedMotion, {
        stagger: 0.08,
        delayChildren: reducedMotion ? 0 : 0.06,
      }),
    [reducedMotion]
  );
  const cardFade = useMemo(() => createFadeUp(reducedMotion, { distance: 10 }), [reducedMotion]);

  const projects = useMemo(() => {
    return [...catalog]
      .filter(projectHasArchitectureContent)
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 4);
  }, [catalog]);

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="border-t border-border bg-gradient-to-b from-background via-accent/[0.03] to-background py-14 sm:py-20"
    >
      <Container>
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Architecture · System design
          </p>
          <h2
            id="architecture-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Architecture &amp; tradeoffs
          </h2>
          <p className="mt-3 text-muted sm:text-lg">
            Senior engineering is not only features—it is choosing the right data model, delivery
            pipeline, and scaling path. Each case study below uses{" "}
            <strong className="font-medium text-foreground/90">interactive diagrams</strong> with a{" "}
            <strong className="font-medium text-foreground/90">basic</strong> vs{" "}
            <strong className="font-medium text-foreground/90">advanced</strong> layer so you can skim
            or go deep on Firebase vs SQL, caching, serverless, CI/CD, and performance calls.
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <motion.p
            className="mx-auto mt-10 max-w-xl text-center text-sm text-muted"
            variants={headerFade}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            Add <code className="rounded bg-border/60 px-1 text-xs">architectureCaseStudy</code> or{" "}
            <code className="rounded bg-border/60 px-1 text-xs">architectureMermaid</code> to your
            projects in JSON or Firestore to surface diagrams and narratives here.
          </motion.p>
        ) : (
          <motion.div
            className="mx-auto mt-12 flex max-w-5xl flex-col gap-12"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.06 }}
          >
            {projects.map((project) => {
              const study = resolveArchitectureStudy(project);
              if (!study) return null;
              const segment = getDetailSegment(project);
              return (
                <motion.article
                  key={project.id ?? project.title}
                  variants={cardFade}
                  className="rounded-2xl border border-border bg-elevated/30 p-5 shadow-sm sm:p-8"
                >
                  <div className="flex flex-col gap-2 border-b border-border/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {project.featured ? "Featured project · " : null}
                        Complexity:{" "}
                        <span className="font-medium text-foreground">{project.complexity}</span>
                      </p>
                    </div>
                    <Link
                      to={`/projects/${encodeURIComponent(segment)}`}
                      className={linkClass}
                    >
                      Open full case study →
                    </Link>
                  </div>
                  <div className="mt-6">
                    <InteractiveArchitectureStudy study={study} compact />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
