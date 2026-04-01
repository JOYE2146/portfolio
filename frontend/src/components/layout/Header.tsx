import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CONTACT_PROFILE } from "@/data/contact-profile";
import { cn } from "@/utils/cn";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    isActive
      ? "bg-elevated text-foreground"
      : "text-muted hover:bg-elevated/80 hover:text-foreground"
  );

const mainNav = [
  { to: "/", label: "Home", end: true },
  { to: "/blog", label: "Blog" },
  { to: "/resume", label: "Résumé" },
  { hash: "about", label: "About" },
  { hash: "skills", label: "Skills" },
  { hash: "architecture", label: "Architecture" },
  { hash: "projects", label: "Projects" },
  { hash: "contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const scrollToHash = useCallback(
    (hash: string) => {
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    []
  );

  const goToSection = useCallback(
    (hash: string) => {
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      if (location.pathname !== "/") {
        void navigate({ pathname: "/", hash: `#${id}` });
      } else {
        scrollToHash(`#${id}`);
      }
      setMobileOpen(false);
    },
    [location.pathname, navigate, scrollToHash]
  );

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;
    const id = location.hash.slice(1);
    if (!id) return;
    const t = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(t);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border",
        "bg-[var(--token-header-bg)] backdrop-blur-md backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-[var(--token-header-bg)]"
      )}
    >
      <Container className="flex h-14 items-center justify-between gap-4 sm:h-[var(--space-header-h)]">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="sm:hidden">{CONTACT_PROFILE.shortName}</span>
          <span className="hidden sm:inline">{CONTACT_PROFILE.fullName}</span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 md:flex"
        >
          {mainNav.map((item) =>
            "to" in item ? (
              <NavLink
                key={item.to}
                to={item.to}
                end={"end" in item && item.end}
                className={navClass}
              >
                {item.label}
              </NavLink>
            ) : (
              <a
                key={item.hash}
                href={`/#${item.hash}`}
                className={cn(navClass({ isActive: false }))}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(item.hash);
                }}
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden",
              "bg-elevated text-foreground",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            )}
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
            ref={closeBtnRef}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden className="text-xl">
              {mobileOpen ? "×" : "≡"}
            </span>
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div
          id={menuId}
          className="border-t border-border bg-background md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) =>
              "to" in item ? (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={"end" in item && item.end}
                  className={(p) => cn(navClass(p), "w-full")}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ) : (
                <a
                  key={item.hash}
                  href={`/#${item.hash}`}
                  className={cn(navClass({ isActive: false }), "w-full")}
                  onClick={(e) => {
                    e.preventDefault();
                    goToSection(item.hash);
                  }}
                >
                  {item.label}
                </a>
              )
            )}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
