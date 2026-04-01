import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/layout/Container";
import { CONTACT_PROFILE, SOCIAL_LINKS } from "@/data/contact-profile";
import { downloadResumePdf } from "@/lib/resumePdf";
import {
  createFadeUp,
  createHoverScale,
  createStaggerContainer,
  defaultViewport,
} from "@/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const cardClass = cn(
  "flex flex-col rounded-xl border border-border bg-elevated/40 p-4 transition-colors",
  "hover:border-accent/25 hover:bg-elevated/70"
);

const extLinkClass = cn(
  "text-sm font-semibold text-accent underline-offset-4 hover:underline",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

export function ContactSection() {
  const reducedMotion = useReducedMotion();
  const [pdfBusy, setPdfBusy] = useState(false);
  const headerFade = useMemo(() => createFadeUp(reducedMotion, { distance: 14 }), [reducedMotion]);
  const stagger = useMemo(
    () =>
      createStaggerContainer(reducedMotion, {
        stagger: 0.06,
        delayChildren: reducedMotion ? 0 : 0.05,
      }),
    [reducedMotion]
  );
  const itemFade = useMemo(() => createFadeUp(reducedMotion, { distance: 10 }), [reducedMotion]);
  const cardHover = useMemo(
    () => createHoverScale(reducedMotion, { scale: 1.012, lift: -2 }),
    [reducedMotion]
  );

  const onPdf = async () => {
    setPdfBusy(true);
    try {
      await downloadResumePdf();
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border bg-gradient-to-b from-accent/[0.04] via-background to-background py-14 sm:py-20"
    >
      <Container>
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
          <h2
            id="contact-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Contact &amp; résumé
          </h2>
          <p className="mt-3 text-muted sm:text-lg">
            Hiring, collaboration, or a technical question? Use the form (EmailJS or your mail app),
            grab a PDF résumé, or message me on{" "}
            <a href={CONTACT_PROFILE.telegram.url} className={extLinkClass}>
              Telegram
            </a>
            .
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-5 lg:gap-12">
          <motion.div
            className="lg:col-span-3"
            variants={headerFade}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <h3 className="text-lg font-semibold text-foreground">Send a message</h3>
            <p className="mt-1 text-sm text-muted">
              Replies usually within a few business days. For fastest casual contact, use Telegram (
              {CONTACT_PROFILE.telegram.handle}).
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </motion.div>

          <div className="space-y-8 lg:col-span-2">
            <motion.div
              variants={headerFade}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <h3 className="text-lg font-semibold text-foreground">Résumé</h3>
              <p className="mt-1 text-sm text-muted">
                One-click PDF export (generated in the browser). For a printable layout with full
                detail, open the résumé page.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  disabled={pdfBusy}
                  onClick={() => void onPdf()}
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm",
                    "hover:border-accent/35 hover:bg-accent/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    "disabled:opacity-60"
                  )}
                >
                  {pdfBusy ? "Preparing PDF…" : `Download ${CONTACT_PROFILE.resumePdfFileName}`}
                </button>
                <Link
                  to="/resume"
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg border border-accent/35 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent",
                    "hover:bg-accent/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  )}
                >
                  View printable résumé
                </Link>
              </div>
            </motion.div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">Profiles</h3>
              <motion.ul
                className="mt-4 grid gap-3"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                role="list"
              >
                {SOCIAL_LINKS.map((s) => (
                  <motion.li key={s.id} variants={itemFade}>
                    <motion.a
                      href={s.href}
                      target={s.id === "email" ? undefined : "_blank"}
                      rel={s.id === "email" ? undefined : "noopener noreferrer"}
                      className={cardClass}
                      {...cardHover}
                    >
                      <span className="font-medium text-foreground">{s.label}</span>
                      <span className="mt-1 text-xs text-muted">{s.description}</span>
                    </motion.a>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
