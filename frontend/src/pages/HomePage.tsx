import { HeroSection } from "@/components/HeroSection";
import { ArchitectureSection } from "@/components/architecture/ArchitectureSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Container } from "@/components/layout/Container";
import { HomeSeo } from "@/components/seo";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { catalogItemToGridItem } from "@/data/project-grid-map";
import {
  collectAllTech,
  filterCatalogByTechAndComplexity,
  sortCatalog,
  type SortMode,
} from "@/data/project-filter";
import type { ProjectComplexity } from "@/data/portfolio-project.types";
import { CONTACT_PROFILE } from "@/data/contact-profile";
import { portfolioProjectRecords } from "@/data/projectGridSource";
import { useFirestoreProjects } from "@/hooks/useFirestoreProjects";
import reactLogo from "@/assets/react.svg";
import viteLogo from "@/assets/vite.svg";
import "@/App.css";
import {
  createFadeUp,
  createStaggerContainer,
  defaultViewport,
} from "@/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

export function HomePage() {
  const reducedMotion = useReducedMotion();
  const nextStagger = useMemo(
    () =>
      createStaggerContainer(reducedMotion, {
        stagger: 0.08,
        delayChildren: reducedMotion ? 0 : 0.06,
      }),
    [reducedMotion]
  );
  const nextFade = useMemo(() => createFadeUp(reducedMotion, { distance: 14 }), [reducedMotion]);

  const { catalog, loading, error } = useFirestoreProjects(portfolioProjectRecords);
  const safeCatalog = catalog ?? [];
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<"all" | ProjectComplexity>("all");
  const [sort, setSort] = useState<SortMode>("featured");

  const allTech = useMemo(() => collectAllTech(safeCatalog), [safeCatalog]);

  const gridProjects = useMemo(() => {
    const filtered = filterCatalogByTechAndComplexity(safeCatalog, selectedTech, complexity);
    const sorted = sortCatalog(filtered, sort);
    return sorted.map(catalogItemToGridItem);
  }, [safeCatalog, selectedTech, complexity, sort]);

  const onTechToggle = (tech: string) => {
    setSelectedTech((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]));
  };

  const onReset = () => {
    setSelectedTech([]);
    setComplexity("all");
    setSort("featured");
  };

  return (
    <>
      <HomeSeo />
      <HeroSection />

      <div className="ticks" aria-hidden />

      <SkillsSection />

      <ArchitectureSection catalog={safeCatalog} />

      <section id="projects" aria-labelledby="projects-heading">
        <ProjectGrid
          titleId="projects-heading"
          projects={gridProjects}
          loading={loading}
          loadError={error}
          filtersSlot={
            <ProjectFilters
              allTech={allTech}
              selectedTech={selectedTech}
              onTechToggle={onTechToggle}
              complexity={complexity}
              onComplexityChange={setComplexity}
              sort={sort}
              onSortChange={setSort}
              onReset={onReset}
            />
          }
          actionSlot={
            <Link
              to="/add-project"
              className="inline-flex items-center rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-accent/40 hover:bg-accent/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              + Add project
            </Link>
          }
        />
        <div id="next-steps" className="border-t border-border bg-elevated/25">
          <Container className="py-12">
            <motion.div
              className="grid gap-10 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={nextStagger}
            >
              <motion.div id="docs" variants={nextFade}>
                <h2 className="text-lg font-semibold text-foreground">Stack &amp; docs</h2>
                <p className="mt-1 text-sm text-muted">Tools this site is built with.</p>
                <ul className="mt-4 list-none space-y-3 p-0">
                  <li>
                    <a
                      href="https://vite.dev/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      <img
                        className="logo h-6 w-6"
                        src={viteLogo}
                        alt=""
                        width={24}
                        height={24}
                        decoding="async"
                      />
                      Vite
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://react.dev/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      <img
                        className="button-icon h-6 w-6"
                        src={reactLogo}
                        alt=""
                        width={24}
                        height={24}
                        decoding="async"
                      />
                      React
                    </a>
                  </li>
                </ul>
              </motion.div>
              <motion.div id="social" variants={nextFade}>
                <h2 className="text-lg font-semibold text-foreground">Connect</h2>
                <p className="mt-1 text-sm text-muted">Links for {CONTACT_PROFILE.shortName}.</p>
                <ul className="mt-4 list-none space-y-2 p-0 text-sm">
                  <li>
                    <Link
                      to="/blog"
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Blog &amp; case studies
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/resume"
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Résumé (print / PDF)
                    </Link>
                  </li>
                  <li>
                    <a
                      href={CONTACT_PROFILE.github.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      GitHub · {CONTACT_PROFILE.github.handle}
                    </a>
                  </li>
                  <li>
                    <a
                      href={CONTACT_PROFILE.telegram.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Telegram {CONTACT_PROFILE.telegram.handle}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${CONTACT_PROFILE.email}`}
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      {CONTACT_PROFILE.email}
                    </a>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </Container>
        </div>
      </section>

      <ContactSection />

      <div className="ticks" aria-hidden />
      <section id="spacer" aria-hidden />
    </>
  );
}
