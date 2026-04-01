import { Container } from "@/components/layout/Container";
import { PageSeo } from "@/components/seo";
import { CONTACT_PROFILE } from "@/data/contact-profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <PageSeo
        title={`Page not found · ${CONTACT_PROFILE.fullName}`}
        description="The page you requested does not exist."
        path="/404"
        noindex
        includeCanonical={false}
      />
      <Container className="py-16 text-center sm:py-24">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">404</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            That URL isn&apos;t part of this site. Check the address or head back home.
          </p>
          <p className="mt-10">
            <Link
              to="/"
              className={cn(
                "inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-lg border border-accent/35 bg-accent/10 px-5 text-sm font-semibold text-accent",
                "transition-colors hover:bg-accent/15",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              )}
            >
              Back home
            </Link>
          </p>
        </motion.div>
      </Container>
    </>
  );
}
