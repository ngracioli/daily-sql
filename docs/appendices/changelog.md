# Changelog

Use this file for repository-level change notes if you do not maintain a separate changelog system.

---

## [2026-06-25]

### Added
- **Database Persistence for SQL Challenges**:
  - Modeled challenge metadata in the primary PostgreSQL database (`dailysql`).
  - Refactored `src/features/challenge/server/challenges-data.ts` to asynchronously fetch challenges from the database using `dbPool` and calculate daily rotation dynamically.
  - Removed static in-memory `CHALLENGES` map to optimize node server memory footprint.
  - Implemented unit tests for the asynchronous methods `getDailyChallenge()` and `getChallengeById(id)` with a mocked `dbPool.query` interface in `challenges-data.test.ts`.
- **Interactive Local Query History**:
  - Implemented client-side query logs persistence using `localStorage`, isolated per challenge ID (`dailysql:history:${challengeId}`).
  - Integrated `Tabs` inside `ExecutionConsole` to view past attempts alongside console output.
  - Added a "Restore" button that loads previous query snippets back into Monaco.
- **Success Celebration Canvas Animation**:
  - Created a custom Canvas Confetti particle explosion component (`Confetti.tsx`) using requestAnimationFrame to render smooth 60fps physics-based celebration bursts upon successful challenge resolution.
- **Multi-Table Schema & Data Visualization**:
  - Refactored the database schema seeds (`init-db.sql`) to store multi-table schema columns and initial datasets as JSON objects.
  - Implemented dynamic normalization inside `challenges-data.ts` mapper to transform single-table and multi-table JSON properties into a unified dictionary structure.
  - Updated autocomplete to suggest each table name (`Struct` kind) and their columns (`Field` kind) with table name indicators.
  - Redesigned `SchemaViewer` to render all challenge tables in styled grids and `DataViewer` to display selection pill buttons allowing users to switch between viewing different initial datasets.
- **Immediate Expected Result Display**:
  - Refactored the GET daily challenge endpoint to execute the solution query inside the database sandbox on load and return the expected query results directly.
  - Updated the page component to load the expected columns and results states on mount, showing the correct target outputs inside the **Expected Result** tab immediately without waiting for query execution.
- **Dynamic SQL Output & Schema Visualization**:
  - Refactored `DataViewer` to support different columns and data sets across three separate views: **Initial Data**, **Expected Result**, and **Your Result**.
  - Dynamic mapping and rendering of user execution rows and columns to show mismatch errors clearly (e.g. 4 columns returned instead of 3).
  - Enhanced `Tabs` component with controlled state support (`activeTabId` and `onTabChange`) to auto-focus the user's execution result tab upon clicking execute.
- **Context-Aware Autocomplete (IntelliSense)**:
  - Registered custom `CompletionItemProvider` in Monaco editor for the `"sql"` language.
  - Suggests standard SQL keywords (`SELECT`, `FROM`, etc.), table names (with Struct icon), and column names (with Field icon) corresponding to the active challenge schema.
  - Organized autocomplete constants and logic into `src/features/editor/model/autocomplete.ts` following Feature-Sliced Design guidelines.
- **Developer & Agent Onboarding Guide (`AGENT.md`)**:
  - Created a comprehensive `/init` onboarding reference file mapping the repository's FSD guidelines, directory structure, sandbox security requirements, lint instructions, and build/test quick-links.
- **Múltiplos Desafios & Rotação Diária**:
  - Adicionados dois novos desafios de SQL (`101` e `102`) englobando consultas de filtros de pedidos e junções de clientes inativos.
  - Implementada lógica em `getDailyChallenge()` para selecionar e rotacionar o desafio de forma automática baseada no dia do ano.
  - Criados testes de unidade em `src/features/challenge/server/__tests__/challenges-data.test.ts` cobrindo o contrato dos desafios e a lógica de rotação diária.
- **Distributed Redis Rate Limiter**:
  - Added a `redis:7-alpine` service to `docker-compose.yml` to store rate-limit metrics.
  - Installed `ioredis` and implemented a production-grade sliding window rate-limiter inside `src/features/challenge/server/rate-limit.ts` using an atomic Lua script (`EVAL`) in exactly one network round trip.
  - Features connection status checking via native ioredis state (`redisClient.status === "ready"`) and namespace isolation (`rl:v1:attempt:${ip}`).
  - Built a memory-safe in-memory fallback sliding window limiter with a background cleanup interval (`setInterval` with `.unref()`) to prevent resource leaks during local development.
  - Wrapped connection pools globally to prevent connection leaks during Next.js hot-reloads.

### Changed
- **Asynchronous Challenge Endpoints**:
  - Updated daily challenge route (`/api/challenges/daily`) and query attempt route (`/api/challenges/attempt`) to fetch metadata dynamically from the PostgreSQL database using `async/await`.
- **Setup Instructions & Docker configuration (README.md / docker-compose.yml)**:
  - Updated configuration guide with detailed instructions for running database and Redis services via Docker Compose, verifying status, manual table seeding, and database volume resets.
  - Removed the obsolete `version` attribute from `docker-compose.yml` to prevent compose warnings.
- **State Derivation Optimization**:
  - Replaced the synchronization `useEffect` inside `DataViewer.tsx` with derived state variables to calculate the active table dynamically. This resolves ESLint `set-state-in-effect` rule warnings and eliminates cascading renders.
- **Next.js & ESLint Quality Updates**:
  - Resolved `no-page-custom-font` warning in layout by removing `<link>` tags and loading Google fonts via standard CSS `@import` in `globals.css`.
  - Suppressed generic image LCP warning on standard `<img />` tags inside the reusable `Avatar.tsx` component.
  - Disabled `@typescript-eslint/no-explicit-any` rules in flat ESLint config (`eslint.config.mjs`) to allow `any` / dynamic record typing for database query rows.
  - Cleaned up parameterless catches (`catch {}`) in `validator.ts` to resolve linter warnings.
