---
title: "Portfolio platform: Firebase, static hosting, and optional offline data"
slug: portfolio-firebase-architecture
date: "2026-03-31"
tags:
  - Case study
  - React
  - Firebase
  - Architecture
type: "case-study"
summary: "How this portfolio balances Firestore-backed CMS features with static JSON, security rules, and a fast Vite shell—end-to-end engineering narrative."
author: "Yoseph"
---

## Problem statement

The site needed **dynamic project data** for demos and interviews, but also **zero-friction local development** for contributors who might not have Firebase credentials. It had to stay fast (SPA + static assets), searchable in the UI, and honest about tradeoffs—not a toy CRUD app.

## System architecture overview

At a high level:

- **Static shell**: HTML/JS/CSS from Vite build, served via a CDN or static host.
- **Data plane**: Firestore for live catalog when configured; **checked-in JSON** as a deterministic fallback.
- **Auth surface**: Optional; writes can be gated while reads stay public for a portfolio grid.

The advanced architecture view adds **CI/CD** (lint/build on push), **security rules** on every Firestore access, and **code-split** heavy viewers (e.g. diagrams) so LCP stays healthy.

## Technology stack and decisions

| Layer | Choice | Rationale |
| ----- | ------ | --------- |
| UI | React 19 + TypeScript | Typed components, ecosystem, hiring signal |
| Styling | Tailwind v4 | Fast iteration, tokenized dark mode |
| Data | Firestore + JSON | Serverless ops; fallback avoids env lock-in |
| Routing | React Router | Simple static hosting, no SSR requirement |
| Content | Markdown + frontmatter | Portable; future CMS can emit the same shape |

**Firebase vs SQL**: A relational DB would imply migrations, connection pools, and an API tier for the same read-heavy, low-write catalog. Firestore maps cleanly to “document per project” and keeps the deployment model serverless.

## Challenges faced

1. **Hydration of two sources** — Firestore and static JSON can disagree; the UI normalizes into one catalog shape and sorts consistently.
2. **Optional Firebase** — Importing the SDK only when env vars exist avoids hard failures in CI and for forks.
3. **Motion vs accessibility** — Animations must respect `prefers-reduced-motion` while still feeling polished for default users.

## Solutions implemented

- A **single hook** loads remote projects when configured, else falls back to JSON; grid and filters always consume the same DTO.
- **Feature detection** around Firebase config with clear UI status in development.
- **Framer Motion** variants centralized with `useReducedMotion` passed from a shared hook.

## Performance optimizations

- Lazy-loaded **Mermaid** for architecture diagrams.
- **Staggered list animations** with small delays—not simultaneous layout thrash.
- **Firestore reads** scoped to one collection; client-side filter/sort avoids server round-trips for demo scale.

Example lazy boundary:

```tsx
const MermaidBlock = lazy(() =>
  import("./MermaidBlock").then((m) => ({ default: m.MermaidBlock }))
);
```

## Final outcome and lessons learned

The portfolio ships as a **fast static app** with an **upgrade path** to managed data. The main lesson: **design the fallback first** (JSON + types), then layer Firestore as an optimization for freshness—not the other way around. That keeps onboarding cheap and production honest.
