import type {
  ArchitectureCaseStudy,
  PerformanceMetric,
  PortfolioProject,
  ProjectComplexity,
} from "@/data/portfolio-project.types";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { isFirebaseConfigured } from "./config";
import { getFirebaseDb } from "./index";

export type NewProjectPayload = {
  title: string;
  description: string;
  tech: string[];
  liveUrl: string;
  repoUrl: string;
  images: string[];
  featured: boolean;
  complexity: ProjectComplexity;
  architectureMermaid?: string;
  challenges?: string[];
  performanceMetrics?: PerformanceMetric[];
};

/**
 * Creates a document in `projects`. Requires Firestore rules that allow this write
 * (e.g. authenticated users, or temporary open rules in dev).
 */
export async function addProject(payload: NewProjectPayload): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Copy frontend/.env.example to .env and add your web app keys."
    );
  }
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, "projects"), {
    title: payload.title.trim(),
    description: payload.description.trim(),
    tech: payload.tech,
    liveUrl: payload.liveUrl.trim(),
    repoUrl: payload.repoUrl.trim(),
    images: payload.images,
    featured: payload.featured,
    complexity: payload.complexity,
    ...(payload.architectureMermaid?.trim()
      ? { architectureMermaid: payload.architectureMermaid.trim() }
      : {}),
    ...(payload.challenges && payload.challenges.length > 0 ? { challenges: payload.challenges } : {}),
    ...(payload.performanceMetrics && payload.performanceMetrics.length > 0
      ? { performanceMetrics: payload.performanceMetrics }
      : {}),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export type FirestoreProject = PortfolioProject & { id: string };

function parseComplexity(value: unknown): ProjectComplexity {
  if (value === "low" || value === "medium" || value === "high") return value;
  return "medium";
}

function toIsoCreatedAt(data: DocumentData): string {
  const raw = data.createdAt;
  if (raw instanceof Timestamp) return raw.toDate().toISOString();
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (typeof raw === "number" && Number.isFinite(raw)) return new Date(raw).toISOString();
  return new Date().toISOString();
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v)).filter(Boolean);
}

function toPerformanceMetrics(value: unknown): PerformanceMetric[] {
  if (!Array.isArray(value)) return [];
  const out: PerformanceMetric[] = [];
  for (const row of value) {
    if (row && typeof row === "object" && "label" in row && "value" in row) {
      const label = String((row as { label: unknown }).label).trim();
      const val = String((row as { value: unknown }).value).trim();
      if (label && val) out.push({ label, value: val });
    }
  }
  return out;
}

function optionalMermaid(value: unknown): string | undefined {
  const s = String(value ?? "").trim();
  return s || undefined;
}

function optionalStringField(value: unknown): string | undefined {
  const s = String(value ?? "").trim();
  return s || undefined;
}

function parseArchitectureCaseStudy(value: unknown): ArchitectureCaseStudy | undefined {
  if (!value || typeof value !== "object") return undefined;
  const o = value as Record<string, unknown>;
  const diagramBasic = String(o.diagramBasic ?? "").trim();
  const diagramAdvanced = optionalStringField(o.diagramAdvanced);
  const stackRationaleBasic = String(o.stackRationaleBasic ?? "").trim();
  const stackRationaleAdvanced = optionalStringField(o.stackRationaleAdvanced);
  const scalabilityBasic = String(o.scalabilityBasic ?? "").trim();
  const scalabilityAdvanced = optionalStringField(o.scalabilityAdvanced);
  const cicdBasic = optionalStringField(o.cicdBasic);
  const cicdAdvanced = optionalStringField(o.cicdAdvanced);
  const performanceDecisions = toStringArray(o.performanceDecisions);

  const hasDiagram = Boolean(diagramBasic || diagramAdvanced);
  const hasNarrative = Boolean(
    stackRationaleBasic ||
      stackRationaleAdvanced ||
      scalabilityBasic ||
      scalabilityAdvanced ||
      cicdBasic ||
      cicdAdvanced ||
      performanceDecisions.length > 0
  );
  if (!hasDiagram && !hasNarrative) return undefined;

  return {
    diagramBasic: diagramBasic || diagramAdvanced || "",
    ...(diagramAdvanced ? { diagramAdvanced } : {}),
    stackRationaleBasic,
    ...(stackRationaleAdvanced ? { stackRationaleAdvanced } : {}),
    scalabilityBasic,
    ...(scalabilityAdvanced ? { scalabilityAdvanced } : {}),
    ...(performanceDecisions.length > 0 ? { performanceDecisions } : {}),
    ...(cicdBasic ? { cicdBasic } : {}),
    ...(cicdAdvanced ? { cicdAdvanced } : {}),
  };
}

/**
 * Maps a Firestore document into the portfolio project shape used by the UI.
 * Documents missing `title` are skipped.
 */
export function normalizeProjectDoc(id: string, data: DocumentData): FirestoreProject | null {
  const title = String(data.title ?? "").trim();
  if (!title) return null;

  const tech = toStringArray(data.tech);
  const images = toStringArray(data.images);

  const challenges = toStringArray(data.challenges);
  const performanceMetrics = toPerformanceMetrics(data.performanceMetrics);
  const architectureMermaid = optionalMermaid(data.architectureMermaid);
  const architectureCaseStudy = parseArchitectureCaseStudy(data.architectureCaseStudy);

  return {
    id,
    title,
    description: String(data.description ?? ""),
    tech,
    liveUrl: String(data.liveUrl ?? ""),
    repoUrl: String(data.repoUrl ?? ""),
    images,
    featured: Boolean(data.featured),
    complexity: parseComplexity(data.complexity),
    createdAt: toIsoCreatedAt(data),
    ...(architectureCaseStudy ? { architectureCaseStudy } : {}),
    ...(architectureMermaid ? { architectureMermaid } : {}),
    ...(challenges.length > 0 ? { challenges } : {}),
    ...(performanceMetrics.length > 0 ? { performanceMetrics } : {}),
  };
}

function sortProjects(a: FirestoreProject, b: FirestoreProject): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

/**
 * Loads all documents from the `projects` collection (same API shape you described,
 * but uses the shared Firebase app from env).
 */
export async function fetchProjects(): Promise<FirestoreProject[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }
  const db = getFirebaseDb();
  const querySnapshot = await getDocs(collection(db, "projects"));
  const rows: FirestoreProject[] = [];

  for (const doc of querySnapshot.docs) {
    const row = normalizeProjectDoc(doc.id, doc.data());
    if (row) rows.push(row);
  }

  rows.sort(sortProjects);
  return rows;
}
