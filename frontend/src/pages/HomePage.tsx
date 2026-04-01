import { HeroSection } from "@/components/HeroSection";
import { Container } from "@/components/layout/Container";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import reactLogo from "@/assets/react.svg";
import viteLogo from "@/assets/vite.svg";
import "@/App.css";

const FEATURED_PROJECTS = [
  {
    title: "Portfolio site",
    description:
      "Personal marketing site with theme toggle, Firebase-ready setup, and a motion system tuned for accessibility.",
    tags: ["React", "TypeScript", "Tailwind", "Vite"],
    href: "https://github.com/JOYE2146/portfolio",
  },
  {
    title: "API & admin pattern",
    description:
      "Structured Express API with validation, JWT admin routes, and a pattern you can extend for CMS-style content.",
    tags: ["Node", "REST", "PostgreSQL"],
  },
  {
    title: "Network automation",
    description:
      "Scripts and labs focused on reliable infrastructure, monitoring concepts, and clear operational documentation.",
    tags: ["Networking", "Automation"],
  },
] as const;

export function HomePage() {
  return (
    <>
      <HeroSection />

      <div className="ticks" aria-hidden />

      <section id="projects" aria-labelledby="projects-heading">
        <ProjectGrid titleId="projects-heading" projects={[...FEATURED_PROJECTS]} />
        <div id="next-steps">
          <div id="docs">
            <svg className="icon" role="presentation" aria-hidden>
              <use href="/icons.svg#documentation-icon" />
            </svg>
            <h2>Documentation</h2>
            <p>Your questions, answered</p>
            <ul>
              <li>
                <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                  <img className="logo" src={viteLogo} alt="" />
                  Explore Vite
                </a>
              </li>
              <li>
                <a href="https://react.dev/" target="_blank" rel="noreferrer">
                  <img className="button-icon" src={reactLogo} alt="" />
                  Learn more
                </a>
              </li>
            </ul>
          </div>
          <div id="social">
            <svg className="icon" role="presentation" aria-hidden>
              <use href="/icons.svg#social-icon" />
            </svg>
            <h2>Connect with us</h2>
            <p>Join the Vite community</p>
            <ul>
              <li>
                <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden>
                    <use href="/icons.svg#github-icon" />
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden>
                    <use href="/icons.svg#discord-icon" />
                  </svg>
                  Discord
                </a>
              </li>
              <li>
                <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden>
                    <use href="/icons.svg#x-icon" />
                  </svg>
                  X.com
                </a>
              </li>
              <li>
                <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden>
                    <use href="/icons.svg#bluesky-icon" />
                  </svg>
                  Bluesky
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-heading">
        <Container className="py-12 sm:py-16">
          <h2 id="contact-heading">Contact</h2>
          <p className="mt-2 max-w-prose text-muted">
            Have a project in mind or want to connect? Send an email—I&apos;ll get back to you as
            soon as I can.
          </p>
          <p className="mt-4">
            <a
              href="mailto:yosephbedasa85@gmail.com"
              className="font-medium text-accent underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              yosephbedasa85@gmail.com
            </a>
          </p>
        </Container>
      </section>

      <div className="ticks" aria-hidden />
      <section id="spacer" aria-hidden />
    </>
  );
}
