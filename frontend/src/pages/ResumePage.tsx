import { Container } from "@/components/layout/Container";
import { PageSeo } from "@/components/seo";
import { CONTACT_PROFILE } from "@/data/contact-profile";
import { downloadResumePdf } from "@/lib/resumePdf";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { Link } from "react-router-dom";

const linkClass = cn(
  "font-semibold text-accent underline-offset-4 hover:underline",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

const h2 = "mt-8 border-b border-border pb-1 text-sm font-bold uppercase tracking-wider text-muted print:mt-6";
const ul = "mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 print:text-[11pt]";

export function ResumePage() {
  const [busy, setBusy] = useState(false);

  const onPdf = async () => {
    setBusy(true);
    try {
      await downloadResumePdf();
    } finally {
      setBusy(false);
    }
  };

  const resumeDesc = `Résumé for ${CONTACT_PROFILE.fullName} — ${CONTACT_PROFILE.headline}. Download PDF or print.`;

  return (
    <>
      <PageSeo
        title={`Résumé · ${CONTACT_PROFILE.fullName}`}
        description={resumeDesc}
        path="/resume"
        ogType="profile"
      />

      <div className="no-print border-b border-border bg-elevated/40">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link to="/" className={linkClass}>
            ← Home
          </Link>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void onPdf()}
              className={cn(
                "rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm",
                "hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                "disabled:opacity-60"
              )}
            >
              {busy ? "Preparing…" : "Download PDF"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className={cn(
                "rounded-lg border border-accent/35 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent",
                "hover:bg-accent/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              )}
            >
              Print / Save as PDF
            </button>
          </div>
        </Container>
      </div>

      <article className="resume-doc text-foreground print:text-black">
        <Container className="max-w-3xl py-10 print:max-w-none print:py-8">
          <header className="border-b border-border pb-6 print:border-black">
            <h1 className="text-3xl font-bold tracking-tight print:text-[22pt]">{CONTACT_PROFILE.fullName}</h1>
            <p className="mt-1 text-lg text-muted print:text-[12pt] print:text-zinc-700">
              {CONTACT_PROFILE.headline}
            </p>
            <p className="mt-2 text-sm text-muted print:text-[10pt] print:text-zinc-600">
              {CONTACT_PROFILE.location}
            </p>
            <ul className="mt-4 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-sm print:text-[10pt]">
              <li>
                <a className={linkClass} href={`mailto:${CONTACT_PROFILE.email}`}>
                  {CONTACT_PROFILE.email}
                </a>
              </li>
              <li>
                <a className={linkClass} href={CONTACT_PROFILE.github.url} target="_blank" rel="noreferrer">
                  github.com/{CONTACT_PROFILE.github.handle}
                </a>
              </li>
              <li>
                <a className={linkClass} href={CONTACT_PROFILE.telegram.url} target="_blank" rel="noreferrer">
                  Telegram {CONTACT_PROFILE.telegram.handle}
                </a>
              </li>
              <li>
                <a className={linkClass} href={CONTACT_PROFILE.linkedin.url} target="_blank" rel="noreferrer">
                  {CONTACT_PROFILE.linkedin.label}
                </a>
              </li>
            </ul>
          </header>

          <section>
            <h2 className={h2}>Summary</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90 print:text-[11pt]">
              {CONTACT_PROFILE.tagline}
            </p>
          </section>

          <section>
            <h2 className={h2}>Technical skills</h2>
            <ul className={ul}>
              <li>
                <strong className="text-foreground">Frontend:</strong> React, TypeScript, Next.js, Vite,
                Tailwind CSS, Redux, responsive & accessible UI patterns
              </li>
              <li>
                <strong className="text-foreground">Backend &amp; data:</strong> Node.js, Express, Firebase /
                Firestore, MongoDB, MySQL, PostgreSQL; REST-style APIs and pragmatic data modeling
              </li>
              <li>
                <strong className="text-foreground">Workflow:</strong> Git, GitHub, CI-friendly builds,
                Markdown docs, Mermaid architecture diagrams, EmailJS or serverless hooks for contact flows
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Selected impact</h2>
            <ul className={ul}>
              <li>
                Shipped a portfolio platform with optional Firestore, static JSON fallback, filters, project
                detail pages, and blog/case-study content from Markdown.
              </li>
              <li>
                Documented system design with basic/advanced architecture layers, scalability notes, and
                performance decisions for stakeholder-ready narratives.
              </li>
              <li>
                Network engineering background informs resilient thinking: latency, caching, CDN static
                assets, and security rules as the enforcement layer—not only UI validation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Education &amp; certifications</h2>
            <p className="mt-3 text-sm text-muted print:text-[11pt] print:text-zinc-700">
              Replace this block with your institutions, graduation years, and certifications. Edit{" "}
              <code className="rounded bg-border/50 px-1 text-xs no-print">ResumePage.tsx</code>
              <span className="no-print"> and </span>
              <code className="rounded bg-border/50 px-1 text-xs no-print">resumePdf.ts</code>
              <span className="no-print"> to keep the site and PDF in sync.</span>
            </p>
            <ul className={`${ul} print:hidden`}>
              <li>Your degree / program — Institution — Year</li>
              <li>Relevant certification — Issuer — Year</li>
            </ul>
          </section>
        </Container>
      </article>
    </>
  );
}
