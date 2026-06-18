# Frontend Architecture (Feature-Sliced + Next.js)

This document maps the Feature-Sliced architecture onto a Next.js + TypeScript codebase.

Layers
- app/pages: Next.js routing and top-level app composition (layouts, providers)
- widgets: composed UI used across the app (often page-level compositions)
- features: feature folders that own slices of functionality (pages, hooks, api-calls)
- entities: domain entities, types and domain logic
- shared: generic libraries, UI primitives, utilities, styles

Next.js notes
- Prefer `src/app` (app router) where possible; `src/pages` is supported for pages-router code.
- Keep server-only code under `app` server components or `src/server` to avoid bundling on client.
