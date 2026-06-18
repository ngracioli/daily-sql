# System Overview

High-level view of the system and its responsibilities.

Summary
- Frontend: Next.js + TypeScript. Responsible for UI, routing, and client-side behavior.
- Backend: API (could be serverless or a separate service). Responsible for business logic and data persistence.
- Data: Database(s), caches, and event streams.
- Infra: Hosting, CI/CD, monitoring.

Boundaries
- Keep UI logic in the frontend. Domain logic and data access belong to backend/services.
