import { InteractiveArchitectureStudy } from "@/components/architecture/InteractiveArchitectureStudy";
import { Container } from "@/components/layout/Container";
import { PageSeo } from "@/components/seo";
import { CONTACT_PROFILE } from "@/data/contact-profile";
import { mapPortfolioProjectToCard } from "@/data/mapPortfolioToCards";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { absoluteUrl } from "@/lib/site-url";
import { resolveArchitectureStudy } from "@/utils/architecture-study";
import { cn } from "@/utils/cn";
import { Link, useParams } from "react-router-dom";

const linkClass = cn(
  "font-semibold text-accent underline-offset-4 hover:underline",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
);

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, loading, error } = useProjectDetail(projectId);

  const links = project ? mapPortfolioProjectToCard(project) : null;

  if (loading) {
    return (
      <Container className="py-16">
        <p className="text-muted" role="status">
          Loading project…
        </p>
      </Container>
    );
  }

  if (!project) {
    return (
      <>
        <PageSeo
          title={`Project not found · ${CONTACT_PROFILE.fullName}`}
          description="This portfolio entry is missing or the link is invalid."
          path={`/projects/${encodeURIComponent(projectId ?? "unknown")}`}
          noindex
          includeCanonical={false}
        />
        <Container className="py-16">
          <p className="text-lg font-medium text-foreground">
            Project not found
          </p>
          {error ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
          <Link
            to="/#projects"
            className={cn(linkClass, "mt-6 inline-block text-sm")}
          >
            ← Back to projects
          </Link>
        </Container>
      </>
    );
  }

  const architectureStudy = resolveArchitectureStudy(project);
  const hasDetailBody =
    architectureStudy !== null ||
    (project.challenges && project.challenges.length > 0) ||
    (project.performanceMetrics && project.performanceMetrics.length > 0);

  const detailPath = `/projects/${encodeURIComponent(projectId ?? "")}`;
  const desc =
    project.description.length > 165
      ? `${project.description.slice(0, 162).trim()}…`
      : project.description;
  const ogFromProject = (project.images ?? []).find((u) =>
    /^https?:\/\//i.test(String(u).trim()),
  );

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: absoluteUrl(detailPath),
    keywords: project.tech.join(", "),
    author: { "@type": "Person", name: CONTACT_PROFILE.fullName },
  };

  return (
    <>
      <PageSeo
        title={`${project.title} · ${CONTACT_PROFILE.fullName}`}
        description={desc}
        path={detailPath}
        ogType="article"
        ogImage={ogFromProject}
        jsonLd={projectJsonLd}
      />
      <article className="border-b border-border pb-16">
        <Container className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb">
            <Link to="/#projects" className={cn(linkClass, "text-sm")}>
              ← Projects
            </Link>
          </nav>

          <header className="mt-6">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {project.title}
              </h1>
              {project.featured ? (
                <span className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                  Featured
                </span>
              ) : null}
            </div>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
              {project.description}
            </p>
            <ul
              className="mt-5 flex list-none flex-wrap gap-2 p-0"
              aria-label="Technologies"
            >
              {project.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Complexity:{" "}
              <span className="font-medium text-foreground">
                {project.complexity}
              </span>
            </p>
          </header>

          {links ? (
            <div className="mt-8 flex flex-wrap gap-6 border-t border-border pt-8">
              {links.href ? (
                <a
                  href={links.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Repository
                </a>
              ) : null}
              {links.liveUrl ? (
                <a
                  href={links.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Live site
                </a>
              ) : null}
            </div>
          ) : null}

          {!hasDetailBody ? (
            <p className="mt-12 text-sm text-muted">
              Add{" "}
              <code className="rounded bg-border/60 px-1 text-xs">
                architectureCaseStudy
              </code>
              ,{" "}
              <code className="rounded bg-border/60 px-1 text-xs">
                architectureMermaid
              </code>
              ,{" "}
              <code className="rounded bg-border/60 px-1 text-xs">
                challenges
              </code>
              , or{" "}
              <code className="rounded bg-border/60 px-1 text-xs">
                performanceMetrics
              </code>{" "}
              in Firestore or{" "}
              <code className="rounded bg-border/60 px-1 text-xs">
                portfolio-projects.json
              </code>{" "}
              to expand this case study.
            </p>
          ) : null}

          {architectureStudy ? (
            <section className="mt-14" aria-labelledby="arch-heading">
              <h2
                id="arch-heading"
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                Architecture &amp; system design
              </h2>
              <p className="mt-2 max-w-prose text-sm text-muted">
                Switch between{" "}
                <strong className="font-medium text-foreground/90">
                  Basic
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground/90">
                  Advanced
                </strong>{" "}
                to skim the diagram or inspect CI/CD, data rules, and scaling
                assumptions.
              </p>
              <div className="mt-6">
                <InteractiveArchitectureStudy study={architectureStudy} />
              </div>
            </section>
          ) : null}

          {project.challenges && project.challenges.length > 0 ? (
            <section className="mt-14" aria-labelledby="challenges-heading">
              <h2
                id="challenges-heading"
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                Challenges
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                {project.challenges.map((c) => (
                  <li key={c} className="text-foreground/90">
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.performanceMetrics &&
          project.performanceMetrics.length > 0 ? (
            <section className="mt-14" aria-labelledby="metrics-heading">
              <h2
                id="metrics-heading"
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                Performance &amp; metrics
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.performanceMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-border bg-elevated/60 px-4 py-3 shadow-sm"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      {m.label}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-foreground">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </Container>
      </article>
    </>
  );
}
