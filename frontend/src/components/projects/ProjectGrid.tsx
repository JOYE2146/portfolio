import {
  createFadeUp,
  createStaggerContainer,
  createStaggerInner,
  defaultViewport,
} from "@/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Container } from "@/components/layout/Container";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ProjectCard, type ProjectCardProps } from "./ProjectCard";

export type ProjectGridItem = Omit<ProjectCardProps, "variants"> & {
  id?: string;
  detailSegment: string;
};

type ProjectGridProps = {
  title?: string;
  /** For `section` `aria-labelledby` — use the same id as the page section */
  titleId?: string;
  /** When omitted or undefined (e.g. race during HMR), grid renders empty */
  projects?: ProjectGridItem[];
  /** Firestore fetch in progress */
  loading?: boolean;
  /** Shown when fetch failed — data may still be static fallback */
  loadError?: string | null;
  /** e.g. link to add-project */
  actionSlot?: ReactNode;
  /** Filter / sort controls */
  filtersSlot?: ReactNode;
};

/**
 * Scroll-triggered stagger (once) + nested card stagger — uses shared animation tokens.
 */
export function ProjectGrid({
  title = "Featured projects",
  titleId,
  projects: projectsProp,
  loading = false,
  loadError = null,
  actionSlot,
  filtersSlot,
}: ProjectGridProps) {
  const projects = projectsProp ?? [];
  const reducedMotion = useReducedMotion();
  const sectionStagger = createStaggerContainer(reducedMotion, {
    stagger: 0.1,
    delayChildren: reducedMotion ? 0 : 0.04,
  });
  const rowStagger = createStaggerInner(reducedMotion, { stagger: 0.07 });
  const fade = createFadeUp(reducedMotion, { duration: 0.45 });

  return (
    <Container className="pb-10 pt-8 sm:pb-12 sm:pt-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={sectionStagger}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.h2
            id={titleId}
            variants={fade}
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {title}
          </motion.h2>
          {actionSlot ? (
            <motion.div variants={fade} className="shrink-0">
              {actionSlot}
            </motion.div>
          ) : null}
        </div>
        {loading ? (
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            Loading projects…
          </p>
        ) : null}
        {loadError ? (
          <p
            className="mt-2 text-sm text-amber-700 dark:text-amber-300"
            role="status"
            aria-live="polite"
          >
            Showing offline projects. ({loadError})
          </p>
        ) : null}
        {filtersSlot ? (
          <motion.div variants={fade} className="mt-6">
            {filtersSlot}
          </motion.div>
        ) : null}
        <motion.div
          variants={rowStagger}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map(({ id, ...card }) => (
            <ProjectCard key={id ?? card.title} {...card} variants={fade} />
          ))}
        </motion.div>
      </motion.div>
    </Container>
  );
}
