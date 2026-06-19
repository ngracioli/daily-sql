<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Structure and Components

AI Agents MUST always follow the structure folders, code organization, and component guidelines defined in the `docs` directory.
Before creating new components or changing the folder structure, you MUST read the following documentation:
- `docs/code-organization/`
- `docs/components/`
- `docs/architecture/`

Always adhere to these guidelines during any refactoring, feature implementation, or architectural changes.

---

# API Implementation & Security Guidelines

Before developing or modifying any server-side routes or execution endpoints, you MUST review:
- [API Contract & Schema Specification](file:///home/ngracioli/www/projects/DailySQL/daily-sql/docs/architecture/api-spec.md)
- [Query Execution Sandbox Design](file:///home/ngracioli/www/projects/DailySQL/daily-sql/docs/architecture/execution-sandbox.md)

### CRITICAL RULES for backend development:
1. **Never Execute Direct User Input**: User-submitted SQL queries must NEVER be run directly on the main database connection pool or target database.
2. **Transaction Sandboxing**: Execute attempts inside isolated database transactions (`BEGIN; ... ROLLBACK;`) under a dedicated, low-privilege database user role (`daily_sql_runner`).
3. **Execution Limits**: Set strict transaction boundaries and query runtimes (`statement_timeout = 1000`).
4. **Sanitization**: Filter and block forbidden SQL keywords (`DROP`, `ALTER`, administrative commands, system catalog functions) prior to execution.
5. **No Solution Exposure**: Never leak `solution_sql` or correct solution payloads to the frontend. All verification and matching logic must occur server-side.

