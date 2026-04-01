import type {
  ArchitectureCaseStudy,
  ProjectCatalogItem,
} from "@/data/portfolio-project.types";

function trimOpt(s: string | undefined): string {
  return typeof s === "string" ? s.trim() : "";
}

/**
 * Merges legacy `architectureMermaid` with optional `architectureCaseStudy`.
 */
export function resolveArchitectureStudy(
  project: Pick<ProjectCatalogItem, "architectureCaseStudy" | "architectureMermaid">
): ArchitectureCaseStudy | null {
  const cs = project.architectureCaseStudy;
  const legacy = trimOpt(project.architectureMermaid);

  if (cs) {
    const diagramBasic = trimOpt(cs.diagramBasic) || legacy;
    const hasNarrative =
      trimOpt(cs.stackRationaleBasic) ||
      trimOpt(cs.stackRationaleAdvanced) ||
      trimOpt(cs.scalabilityBasic) ||
      trimOpt(cs.scalabilityAdvanced) ||
      trimOpt(cs.cicdBasic) ||
      trimOpt(cs.cicdAdvanced) ||
      (cs.performanceDecisions && cs.performanceDecisions.length > 0);
    if (!diagramBasic && !hasNarrative) {
      return legacy
        ? { diagramBasic: legacy, stackRationaleBasic: "", scalabilityBasic: "" }
        : null;
    }
    return { ...cs, diagramBasic };
  }

  if (legacy) {
    return {
      diagramBasic: legacy,
      stackRationaleBasic: "",
      scalabilityBasic: "",
    };
  }

  return null;
}

export function architectureHasAdvancedLayer(study: ArchitectureCaseStudy): boolean {
  return Boolean(
    trimOpt(study.diagramAdvanced) ||
      trimOpt(study.stackRationaleAdvanced) ||
      trimOpt(study.scalabilityAdvanced) ||
      trimOpt(study.cicdAdvanced)
  );
}

/** Pick advanced copy when present; otherwise fall back to basic. */
export function pickArchitectureLayer(
  layer: "basic" | "advanced",
  basic: string | undefined,
  advanced: string | undefined
): string {
  const b = trimOpt(basic);
  const a = trimOpt(advanced);
  if (layer === "advanced" && a) return a;
  return b || a;
}

export function projectHasArchitectureContent(project: ProjectCatalogItem): boolean {
  return resolveArchitectureStudy(project) !== null;
}
