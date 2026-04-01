---
title: "Practical Vite + React performance checklist"
slug: vite-react-performance
date: "2026-03-28"
tags:
  - React
  - Performance
  - Vite
type: blog
summary: "A concise checklist for bundle size, lazy loading, and runtime wins in modern React SPAs—without premature optimization."
author: "Yoseph"
---

## Why this matters

Users feel latency in **LCP**, **TTI**, and janky interactions long before they read your README. This post collects patterns that pay off in real portfolios and dashboards.

## Code splitting routes

Split heavy pages so the initial download stays small:

```tsx
import { lazy, Suspense } from "react";

const ProjectDetail = lazy(() => import("./pages/ProjectDetailPage"));

export function AppRoutes() {
  return (
    <Suspense fallback={<p className="p-4 text-muted">Loading…</p>}>
      <ProjectDetail />
    </Suspense>
  );
}
```

## Defer non-critical libraries

Charts, maps, and syntax-heavy editors rarely belong in the critical path. Load them when the user navigates to a route that needs them—or on `requestIdleCallback` for below-the-fold widgets.

## Lists and formatting sanity

- Prefer **transform** / **opacity** for animations (compositor-friendly).
- Avoid anonymous `() => {}` in hot child components when a stable callback works.
- Measure with the Performance panel, then fix what actually regresses `INP`.

## Takeaway

Ship a fast shell first, then add weight where user intent proves the cost is worth it.
