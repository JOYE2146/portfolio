import { Container } from "@/components/layout/Container";
import { cn } from "@/utils/cn";
import { useCallback } from "react";
import { Link } from "react-router-dom";

const footerLink = cn(
  "text-sm text-muted transition-colors hover:text-foreground",
  "focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
);

const social = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://linkedin.com", label: "LinkedIn" },
] as const;

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
                <a href="/#about" className={footerLink}>
                  About
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
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Connect</p>
            <ul className="mt-4 flex flex-col gap-2" role="list">
              {social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLink}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-6 sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-muted">
              Built with React, Vite, and Tailwind CSS. Semantic layout, accessible
              navigation, and class-based theming.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-muted">© {year} Portfolio</p>
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
