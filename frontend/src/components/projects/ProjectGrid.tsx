import {
  createFadeUp,
  createStaggerContainer,
  createStaggerInner,
  defaultViewport,
} from "@/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Container } from "@/components/layout/Container";
import { motion } from "framer-motion";
import { ProjectCard, type ProjectCardProps } from "./ProjectCard";

type ProjectGridProps = {
  title?: string;
  /** For `section` `aria-labelledby` — use the same id as the page section */
  titleId?: string;
  projects: Omit<ProjectCardProps, "variants">[];
};

/**
 * Scroll-triggered stagger (once) + nested card stagger — uses shared animation tokens.
 */
export function ProjectGrid({ title = "Featured projects", titleId, projects }: ProjectGridProps) {
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
        <motion.h2
          id={titleId}
          variants={fade}
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {title}
        </motion.h2>
        <motion.div
          variants={rowStagger}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} variants={fade} />
          ))}
        </motion.div>
      </motion.div>
    </Container>
  );
}
