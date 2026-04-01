import { Container } from "@/components/layout/Container";
import { CONTACT_PROFILE, SOCIAL_LINKS } from "@/data/contact-profile";
import { cn } from "@/utils/cn";
import { useCallback } from "react";
import { Link } from "react-router-dom";

const footerLink = cn(
  "text-sm text-muted transition-colors hover:text-foreground",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

export function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer
      className="mt-auto border-t border-border bg-elevated/50"
      role="contentinfo"
    >
      <Container className="py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <p className="text-sm font-semibold text-foreground">Navigate</p>
            <ul className="mt-4 flex flex-col gap-2" role="list">
              <li>
                <Link to="/" className={footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className={footerLink}>
                  Blog
                </Link>
              </li>
              <li>
                <a href="/#about" className={footerLink}>
                  About
                </a>
              </li>
              <li>
                <a href="/#skills" className={footerLink}>
                  Skills
                </a>
              </li>
              <li>
                <a href="/#architecture" className={footerLink}>
                  Architecture
                </a>
              </li>
              <li>
                <a href="/#projects" className={footerLink}>
                  Projects
                </a>
              </li>
              <li>
                <a href="/#contact" className={footerLink}>
                  Contact
                </a>
              </li>
              <li>
                <Link to="/resume" className={footerLink}>
                  Résumé
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Connect</p>
            <ul className="mt-4 flex flex-col gap-2" role="list">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target={s.id === "email" ? undefined : "_blank"}
                    rel={s.id === "email" ? undefined : "noopener noreferrer"}
                    className={footerLink}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">{CONTACT_PROFILE.fullName}</p>
          </div>
          <div className="flex flex-col justify-between gap-6 sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-muted">
              Built with React, Vite, and Tailwind CSS. Semantic layout, accessible
              navigation, and class-based theming.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-muted">
                © {year} {CONTACT_PROFILE.fullName}
              </p>
              <button
                type="button"
                onClick={scrollTop}
                className={cn(
                  "text-sm font-medium text-accent underline-offset-4 hover:underline",
                  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                )}
              >
                Back to top
              </button>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
