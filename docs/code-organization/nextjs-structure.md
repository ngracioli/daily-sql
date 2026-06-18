# Next.js Structure

Notes for working in a Next.js + TypeScript codebase.

Recommendations
- Use `src/app` router for new pages where possible.
- Keep server components and server-only code isolated to avoid client bundles.
- Place route handlers under `src/app/<route>/route.ts` for API routes when using the app router.

Example directories
- src/app — top-level app, layouts and page entries
- src/components or src/shared/ui — shared components
- src/features — feature-scoped code
