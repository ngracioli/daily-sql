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
- **Setup Instructions (README.md)**:
  - Updated configuration guide with detailed instructions for running database and Redis services via Docker Compose, verifying status, manual table seeding, and database volume resets.
- **Asynchronous Rate Limiting**:
  - Migrated `checkRateLimit` and route handlers to be asynchronous to support non-blocking network calls.
- **ESLint & Quality Updates**:
  - Disabled `@typescript-eslint/no-explicit-any` rules in flat ESLint config (`eslint.config.mjs`) to allow `any` / dynamic record typing for database query rows.
  - Cleaned up parameterless catches (`catch {}`) in `validator.ts` to resolve linter warnings.
