# Changelog

Use this file for repository-level change notes if you do not maintain a separate changelog system.

---

## [2026-06-25]

### Added
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
- **Distributed Redis Rate Limiter**:
  - Added a `redis:7-alpine` service to `docker-compose.yml` to store rate-limit metrics.
  - Installed `ioredis` and implemented a hybrid rate-limiter in `src/shared/lib/rate-limit.ts` utilizing `INCR` / `EXPIRE` commands, with automatic in-memory sliding window fallback.
  - Wrapped connection pools globally to prevent connection leaks during Next.js hot-reloads.

### Changed
- **Asynchronous Rate Limiting**:
  - Migrated `checkRateLimit` and route handlers to be asynchronous to support non-blocking network calls.
- **ESLint & Quality Updates**:
  - Disabled `@typescript-eslint/no-explicit-any` rules in flat ESLint config (`eslint.config.mjs`) to allow `any` / dynamic record typing for database query rows.
  - Cleaned up parameterless catches (`catch {}`) in `validator.ts` to resolve linter warnings.
