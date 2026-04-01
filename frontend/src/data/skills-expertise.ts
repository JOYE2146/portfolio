export type SkillCategory =
  | "frontend"
  | "backend"
  | "devops"
  | "testing"
  | "architecture";

export type SkillLevelLabel = "Beginner" | "Intermediate" | "Advanced";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  /** 0–100 for progress visualization */
  levelPercent: number;
  levelLabel: SkillLevelLabel;
  years?: number;
  /** Depth: real-world usage, frameworks, concepts */
  tooltip: string;
  /** simple-icons slug for cdn.simpleicons.org */
  iconSlug?: string;
  /** Hex without # */
  iconColor?: string;
}

export const SKILL_CATEGORIES: {
  id: SkillCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "frontend",
    label: "Frontend",
    description: "UI, frameworks, styling, and client-side architecture.",
  },
  {
    id: "backend",
    label: "Backend",
    description: "APIs, runtimes, databases, and server-side logic.",
  },
  {
    id: "devops",
    label: "DevOps",
    description: "Shipping, hosting, tooling, and collaboration workflows.",
  },
  {
    id: "testing",
    label: "Testing",
    description: "Quality gates, automation, and confidence in releases.",
  },
  {
    id: "architecture",
    label: "Architecture",
    description: "System design, integration patterns, and scalable structure.",
  },
];

/**
 * Skills aggregated from your reference stacks (React/Next/Node/Mongo/MySQL,
 * Shopify/WordPress/PHP/PostgreSQL, Angular/Python/Flutter, etc.) plus
 * explicit testing and architecture depth.
 */
export const SKILLS: Skill[] = [
  // —— Frontend (from all three visuals) ——
  {
    id: "react",
    name: "React",
    category: "frontend",
    levelPercent: 92,
    levelLabel: "Advanced",
    years: 4,
    tooltip:
      "Production SPAs and dashboards; hooks, context, code-splitting, performance tuning (memo, lazy routes). Comfortable extending design systems and integrating REST/Firestore.",
    iconSlug: "react",
    iconColor: "61DAFB",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    levelPercent: 88,
    levelLabel: "Advanced",
    years: 3,
    tooltip:
      "App Router and Pages; SSR/SSG tradeoffs, API routes, image optimization, and deployment patterns on Vercel-style hosts.",
    iconSlug: "nextdotjs",
    iconColor: "000000",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    levelPercent: 90,
    levelLabel: "Advanced",
    years: 3,
    tooltip:
      "Strict typing in large codebases, generics, utility types, and narrowing for safer refactors across React and Node.",
    iconSlug: "typescript",
    iconColor: "3178C6",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "frontend",
    levelPercent: 94,
    levelLabel: "Advanced",
    years: 5,
    tooltip:
      "ES modules, async flows, DOM APIs when needed, and debugging complex client state without framework magic.",
    iconSlug: "javascript",
    iconColor: "F7DF1E",
  },
  {
    id: "html5",
    name: "HTML5",
    category: "frontend",
    levelPercent: 95,
    levelLabel: "Advanced",
    years: 5,
    tooltip:
      "Semantic structure, accessibility landmarks, forms, and media—paired with CSS for resilient layouts.",
    iconSlug: "html5",
    iconColor: "E34F26",
  },
  {
    id: "css3",
    name: "CSS3",
    category: "frontend",
    levelPercent: 90,
    levelLabel: "Advanced",
    years: 5,
    tooltip:
      "Flexbox, grid, custom properties, animations, and responsive patterns; comfortable debugging specificity and cascade issues.",
    iconSlug: "css3",
    iconColor: "1572B6",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    levelPercent: 88,
    levelLabel: "Advanced",
    years: 3,
    tooltip:
      "Utility-first UI at speed; design tokens, dark mode, and component extraction without fighting the framework.",
    iconSlug: "tailwindcss",
    iconColor: "06B6D4",
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    category: "frontend",
    levelPercent: 78,
    levelLabel: "Intermediate",
    years: 4,
    tooltip:
      "Rapid prototyping and legacy maintenance; grid, components, and theming when projects standardize on Bootstrap.",
    iconSlug: "bootstrap",
    iconColor: "7952B3",
  },
  {
    id: "redux",
    name: "Redux",
    category: "frontend",
    levelPercent: 72,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "Predictable state in larger apps; Redux Toolkit patterns, selectors, and middleware for side effects.",
    iconSlug: "redux",
    iconColor: "764ABC",
  },
  {
    id: "jquery",
    name: "jQuery",
    category: "frontend",
    levelPercent: 65,
    levelLabel: "Intermediate",
    years: 3,
    tooltip:
      "Maintaining and enhancing older codebases; DOM plugins, AJAX, and progressive enhancement where still required.",
    iconSlug: "jquery",
    iconColor: "0769AD",
  },
  {
    id: "angular",
    name: "Angular",
    category: "frontend",
    levelPercent: 58,
    levelLabel: "Intermediate",
    years: 1,
    tooltip:
      "Component modules, dependency injection, and RxJS-heavy flows; comfortable navigating enterprise Angular apps.",
    iconSlug: "angular",
    iconColor: "DD0031",
  },
  {
    id: "flutter",
    name: "Flutter",
    category: "frontend",
    levelPercent: 55,
    levelLabel: "Intermediate",
    years: 1,
    tooltip:
      "Cross-platform UI with widgets and state management; bridging to native where needed for mobile experiences.",
    iconSlug: "flutter",
    iconColor: "02569B",
  },

  // —— Backend ——
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    levelPercent: 86,
    levelLabel: "Advanced",
    years: 4,
    tooltip:
      "REST and JSON APIs, streams, file handling, and npm ecosystem; pairing with Express or lightweight servers.",
    iconSlug: "nodedotjs",
    iconColor: "339933",
  },
  {
    id: "express",
    name: "Express",
    category: "backend",
    levelPercent: 84,
    levelLabel: "Advanced",
    years: 4,
    tooltip:
      "Middleware design, routers, error handling, validation, and structured layering (controllers/services).",
    iconSlug: "express",
    iconColor: "000000",
  },
  {
    id: "php",
    name: "PHP",
    category: "backend",
    levelPercent: 70,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "WordPress hooks, custom themes/plugins, and classic LAMP-style endpoints when the stack demands it.",
    iconSlug: "php",
    iconColor: "777BB4",
  },
  {
    id: "python",
    name: "Python",
    category: "backend",
    levelPercent: 68,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "Scripting, automation, and API prototypes; comfortable reading scientific/tooling code and integrating services.",
    iconSlug: "python",
    iconColor: "3776AB",
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "backend",
    levelPercent: 80,
    levelLabel: "Advanced",
    years: 3,
    tooltip:
      "Firestore rules, Auth, Hosting, and client SDK patterns; pragmatic security and offline-friendly data modeling.",
    iconSlug: "firebase",
    iconColor: "DD2C00",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "backend",
    levelPercent: 82,
    levelLabel: "Advanced",
    years: 3,
    tooltip:
      "Document modeling, indexing, aggregation pipelines, and when to normalize vs embed for read/write patterns.",
    iconSlug: "mongodb",
    iconColor: "47A248",
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "backend",
    levelPercent: 78,
    levelLabel: "Intermediate",
    years: 3,
    tooltip:
      "Relational schema design, joins, transactions, and performance basics (indexes, explain plans).",
    iconSlug: "mysql",
    iconColor: "4479A1",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    levelPercent: 75,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "Strong typing, constraints, JSON columns, and migrations; preference for Postgres on new relational work.",
    iconSlug: "postgresql",
    iconColor: "4169E1",
  },
  {
    id: "wordpress",
    name: "WordPress",
    category: "backend",
    levelPercent: 72,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "Custom post types, Gutenberg blocks, and PHP integration for content-heavy marketing and brochure sites.",
    iconSlug: "wordpress",
    iconColor: "21759B",
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "backend",
    levelPercent: 62,
    levelLabel: "Intermediate",
    years: 1,
    tooltip:
      "Theme Liquid, storefront APIs, and merchant workflows; integrating third-party apps and checkout-adjacent UX.",
    iconSlug: "shopify",
    iconColor: "7AB55C",
  },

  // —— DevOps & tooling ——
  {
    id: "git",
    name: "Git",
    category: "devops",
    levelPercent: 88,
    levelLabel: "Advanced",
    years: 5,
    tooltip:
      "Branching strategies, rebasing vs merge, bisect, and clean history for team collaboration.",
    iconSlug: "git",
    iconColor: "F05032",
  },
  {
    id: "github",
    name: "GitHub",
    category: "devops",
    levelPercent: 90,
    levelLabel: "Advanced",
    years: 5,
    tooltip:
      "Actions for CI, PR reviews, releases, and project hygiene; comfortable with org-level permissions.",
    iconSlug: "github",
    iconColor: "181717",
  },
  {
    id: "npm",
    name: "npm",
    category: "devops",
    levelPercent: 85,
    levelLabel: "Advanced",
    years: 4,
    tooltip:
      "Package publishing, lockfiles, audits, workspaces, and resolving dependency trees safely.",
    iconSlug: "npm",
    iconColor: "CB3837",
  },
  {
    id: "heroku",
    name: "Heroku",
    category: "devops",
    levelPercent: 65,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "Deploy pipelines, add-ons, and dyno sizing; understanding limits vs container-first platforms.",
    iconSlug: "heroku",
    iconColor: "430098",
  },
  {
    id: "markdown",
    name: "Markdown",
    category: "devops",
    levelPercent: 92,
    levelLabel: "Advanced",
    years: 5,
    tooltip:
      "Docs, READMEs, ADRs, and wiki content; tables, diagrams-as-code adjacent workflows.",
    iconSlug: "markdown",
    iconColor: "000000",
  },
  {
    id: "vite",
    name: "Vite",
    category: "devops",
    levelPercent: 82,
    levelLabel: "Advanced",
    years: 2,
    tooltip:
      "Fast dev server, env handling, and production builds for React SPAs; plugin ecosystem when needed.",
    iconSlug: "vite",
    iconColor: "646CFF",
  },

  // —— Testing ——
  {
    id: "jest",
    name: "Jest",
    category: "testing",
    levelPercent: 72,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "Unit tests, mocks, snapshots where appropriate, and CI integration for regression safety.",
    iconSlug: "jest",
    iconColor: "C21325",
  },
  {
    id: "vitest",
    name: "Vitest",
    category: "testing",
    levelPercent: 70,
    levelLabel: "Intermediate",
    years: 1,
    tooltip:
      "Vite-native test runner; fast feedback loops aligned with modern frontend tooling.",
    iconSlug: "vitest",
    iconColor: "6E9F18",
  },
  {
    id: "cypress",
    name: "Cypress",
    category: "testing",
    levelPercent: 62,
    levelLabel: "Intermediate",
    years: 1,
    tooltip:
      "E2E happy paths and critical user journeys; stable selectors and flake reduction basics.",
    iconSlug: "cypress",
    iconColor: "17202C",
  },
  {
    id: "rtl",
    name: "React Testing Library",
    category: "testing",
    levelPercent: 74,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "Testing components from the user’s perspective; queries, async utilities, and avoiding implementation-detail tests.",
    iconSlug: "testinglibrary",
    iconColor: "E33332",
  },
  {
    id: "playwright",
    name: "Playwright",
    category: "testing",
    levelPercent: 58,
    levelLabel: "Intermediate",
    years: 1,
    tooltip:
      "Cross-browser automation and trace debugging; growing use for smoke suites and visual regression prep.",
    iconSlug: "playwright",
    iconColor: "2EAD33",
  },

  // —— Architecture & system design ——
  {
    id: "rest",
    name: "REST API design",
    category: "architecture",
    levelPercent: 86,
    levelLabel: "Advanced",
    years: 4,
    tooltip:
      "Resource modeling, status codes, pagination, versioning, idempotency, and OpenAPI-friendly contracts.",
  },
  {
    id: "system-design",
    name: "System design",
    category: "architecture",
    levelPercent: 78,
    levelLabel: "Intermediate",
    years: 3,
    tooltip:
      "Load balancing, caching layers, CDNs, and database choice tradeoffs; diagrams and incremental scaling narratives.",
  },
  {
    id: "microservices",
    name: "Service boundaries",
    category: "architecture",
    levelPercent: 70,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "When to split monoliths, synchronous vs async integration, and operational cost of distributed systems.",
  },
  {
    id: "event-driven",
    name: "Event-driven patterns",
    category: "architecture",
    levelPercent: 65,
    levelLabel: "Intermediate",
    years: 2,
    tooltip:
      "Queues, webhooks, and fan-out; understanding delivery guarantees and duplicate handling.",
  },
  {
    id: "security",
    name: "Security mindset",
    category: "architecture",
    levelPercent: 80,
    levelLabel: "Advanced",
    years: 4,
    tooltip:
      "AuthN/Z, OWASP-aware reviews, secrets handling, CORS, and rule hardening for Firestore/HTTP APIs.",
  },
  {
    id: "performance",
    name: "Web performance",
    category: "architecture",
    levelPercent: 76,
    levelLabel: "Intermediate",
    years: 3,
    tooltip:
      "Core Web Vitals, bundle budgets, lazy loading, and server/client rendering tradeoffs for perceived speed.",
  },
];

export function skillsByCategory(category: SkillCategory | "all"): Skill[] {
  if (category === "all") return SKILLS;
  return SKILLS.filter((s) => s.category === category);
}

export function averagePercentForCategory(category: SkillCategory): number {
  const list = SKILLS.filter((s) => s.category === category);
  if (!list.length) return 0;
  return Math.round(
    list.reduce((a, s) => a + s.levelPercent, 0) / list.length
  );
}
