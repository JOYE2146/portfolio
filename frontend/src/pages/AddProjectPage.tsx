import { Container } from "@/components/layout/Container";
import { PageSeo } from "@/components/seo";
import { MotionAnchor } from "@/components/ui/MotionAnchor";
import { CONTACT_PROFILE } from "@/data/contact-profile";
import type {
  PerformanceMetric,
  ProjectComplexity,
} from "@/data/portfolio-project.types";
import { notifyProjectsUpdated } from "@/lib/firebase/project-events";
import { addProject } from "@/lib/firebase/projects";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { cn } from "@/utils/cn";
import { signInAnonymously } from "firebase/auth";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

function parseCommaList(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseChallengeLines(raw: string): string[] {
  return raw
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePerformanceLines(raw: string): PerformanceMetric[] {
  const out: PerformanceMetric[] = [];
  for (const line of raw.split("\n")) {
    const i = line.indexOf(":");
    if (i <= 0) continue;
    const label = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (label && value) out.push({ label, value });
  }
  return out;
}

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";
const inputClass = cn(
  "w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground shadow-sm",
  "placeholder:text-muted/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
);

export function AddProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techRaw, setTechRaw] = useState("React, TypeScript, Tailwind");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [imagesRaw, setImagesRaw] = useState("");
  const [architectureMermaidRaw, setArchitectureMermaidRaw] = useState("");
  const [challengesRaw, setChallengesRaw] = useState("");
  const [metricsLinesRaw, setMetricsLinesRaw] = useState("");
  const [featured, setFeatured] = useState(false);
  const [complexity, setComplexity] = useState<ProjectComplexity>("medium");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    const d = description.trim();
    if (!t || !d) {
      setError("Title and description are required.");
      return;
    }

    if (!isFirebaseConfigured()) {
      setError(
        "Firebase is not configured. Add VITE_FIREBASE_* keys to frontend/.env first.",
      );
      return;
    }

    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch {
          /* Rules may still allow writes without auth in dev */
        }
      }

      const images = parseCommaList(imagesRaw).filter((u) =>
        /^https?:\/\//i.test(u),
      );
      const challenges = parseChallengeLines(challengesRaw);
      const performanceMetrics = parsePerformanceLines(metricsLinesRaw);

      await addProject({
        title: t,
        description: d,
        tech: parseCommaList(techRaw),
        liveUrl: liveUrl.trim(),
        repoUrl: repoUrl.trim(),
        images,
        featured,
        complexity,
        ...(architectureMermaidRaw.trim()
          ? { architectureMermaid: architectureMermaidRaw.trim() }
          : {}),
        ...(challenges.length > 0 ? { challenges } : {}),
        ...(performanceMetrics.length > 0 ? { performanceMetrics } : {}),
      });

      notifyProjectsUpdated();
      navigate("/");
      window.setTimeout(() => {
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save project.";
      setError(
        `${message} Enable Anonymous sign-in in Firebase (Authentication → Sign-in method) or adjust Firestore rules for writes.`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageSeo
        title={`Add project · ${CONTACT_PROFILE.fullName}`}
        description="Submit a new portfolio entry to Firestore (authenticated)."
        path="/add-project"
        noindex
      />
      <Container className="py-12 sm:py-16">
        <p className="text-sm text-muted">
          <Link
            to="/"
            className="font-medium text-accent underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Back to home
          </Link>
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
          Add a project
        </h1>
        <p className="mt-2 max-w-prose text-muted">
          New entries are saved to the Firestore{" "}
          <code className="rounded bg-border/60 px-1 py-0.5 text-xs">
            projects
          </code>{" "}
          collection and appear on the home page after submit.
        </p>
        {!isFirebaseConfigured() ? (
          <p
            className="mt-4 max-w-prose rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
            role="status"
          >
            Firebase env vars are missing. Copy{" "}
            <code className="font-mono text-xs">frontend/.env.example</code> to{" "}
            <code className="font-mono text-xs">frontend/.env</code> and paste
            your web app config from the Firebase console (at minimum{" "}
            <code className="font-mono text-xs">VITE_FIREBASE_API_KEY</code> and{" "}
            <code className="font-mono text-xs">VITE_FIREBASE_PROJECT_ID</code>
            ). Saving is disabled until then.
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-xl space-y-5"
          aria-disabled={!isFirebaseConfigured()}
        >
          <div>
            <label htmlFor="project-title" className={labelClass}>
              Title <span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="project-title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Portfolio Website"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="project-description" className={labelClass}>
              Description{" "}
              <span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <textarea
              id="project-description"
              name="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(inputClass, "resize-y min-h-[100px]")}
              placeholder="What you built and why it matters."
            />
          </div>

          <div>
            <label htmlFor="project-tech" className={labelClass}>
              Tech stack (comma-separated)
            </label>
            <input
              id="project-tech"
              name="tech"
              value={techRaw}
              onChange={(e) => setTechRaw(e.target.value)}
              className={inputClass}
              placeholder="React, Tailwind, Firebase"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="project-repo" className={labelClass}>
                Repository URL
              </label>
              <input
                id="project-repo"
                name="repoUrl"
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className={inputClass}
                placeholder="https://github.com/you/repo"
              />
            </div>
            <div>
              <label htmlFor="project-live" className={labelClass}>
                Live site URL
              </label>
              <input
                id="project-live"
                name="liveUrl"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className={inputClass}
                placeholder="https://…"
              />
            </div>
          </div>

          <div>
            <label htmlFor="project-images" className={labelClass}>
              Image URLs (comma-separated, https only)
            </label>
            <textarea
              id="project-images"
              name="images"
              rows={2}
              value={imagesRaw}
              onChange={(e) => setImagesRaw(e.target.value)}
              className={cn(inputClass, "resize-y font-mono text-xs")}
              placeholder="https://…/screenshot.png"
            />
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-sm font-semibold text-foreground">
              Case study (optional)
            </h2>
            <p className="mt-1 text-xs text-muted">
              Shown on the project detail page. Mermaid supports flowchart,
              sequenceDiagram, etc.
            </p>
          </div>

          <div>
            <label htmlFor="project-mermaid" className={labelClass}>
              Architecture (Mermaid)
            </label>
            <textarea
              id="project-mermaid"
              name="architectureMermaid"
              rows={6}
              value={architectureMermaidRaw}
              onChange={(e) => setArchitectureMermaidRaw(e.target.value)}
              className={cn(inputClass, "resize-y font-mono text-xs")}
              placeholder={"flowchart LR\n  A[App] --> B[(DB)]"}
            />
          </div>

          <div>
            <label htmlFor="project-challenges" className={labelClass}>
              Challenges (one per line)
            </label>
            <textarea
              id="project-challenges"
              name="challenges"
              rows={3}
              value={challengesRaw}
              onChange={(e) => setChallengesRaw(e.target.value)}
              className={cn(inputClass, "resize-y")}
              placeholder="Describe tradeoffs or hard problems…"
            />
          </div>

          <div>
            <label htmlFor="project-metrics" className={labelClass}>
              Performance metrics (one per line,{" "}
              <code className="text-xs">Label: Value</code>)
            </label>
            <textarea
              id="project-metrics"
              name="metrics"
              rows={3}
              value={metricsLinesRaw}
              onChange={(e) => setMetricsLinesRaw(e.target.value)}
              className={cn(inputClass, "resize-y font-mono text-xs")}
              placeholder={"Lighthouse perf: 95\nBundle gzip: 180kb"}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="size-4 rounded border-border text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              Featured
            </label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="project-complexity"
                className="text-sm font-medium text-foreground"
              >
                Complexity
              </label>
              <select
                id="project-complexity"
                name="complexity"
                value={complexity}
                onChange={(e) =>
                  setComplexity(e.target.value as ProjectComplexity)
                }
                className={inputClass}
                style={{ width: "auto", minWidth: "8rem" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {error ? (
            <p
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={busy || !isFirebaseConfigured()}
              className={cn(
                "inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md",
                "hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                "disabled:pointer-events-none disabled:opacity-60",
              )}
            >
              {busy ? "Saving…" : "Save project"}
            </button>
            <MotionAnchor href="/" variant="secondary">
              Cancel
            </MotionAnchor>
          </div>
        </form>
      </Container>
    </>
  );
}
