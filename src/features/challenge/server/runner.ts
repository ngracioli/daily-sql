import { sandboxPool } from "./db";

export interface ExecutionResult {
  rows: any[];
  fields: { name: string; dataTypeID: number }[];
}

export interface SandboxOutcome {
  userResults: ExecutionResult | null;
  solutionResults: ExecutionResult | null;
  error: string | null;
  executionTimeMs: number;
}

/**
 * Runs user query and solution query in a sandboxed, rollback-only transaction.
 */
export async function runInSandbox(
  schemaSql: string,
  seedSql: string,
  userSql: string,
  solutionSql: string
): Promise<SandboxOutcome> {
  const client = await sandboxPool.connect();
  let executionTimeMs = 0;
  let userResults: ExecutionResult | null = null;
  let solutionResults: ExecutionResult | null = null;
  let error: string | null = null;

  try {
    // 1. Begin transaction
    await client.query("BEGIN;");

    // 2. Set runtime constraints
    await client.query("SET LOCAL statement_timeout = 1000;"); // 1 second timeout
    await client.query("SET LOCAL work_mem = '32MB';");

    // 3. Populate sandbox with schema DDL and Seed Data
    if (schemaSql && schemaSql.trim() !== "") {
      await client.query(schemaSql);
    }
    if (seedSql && seedSql.trim() !== "") {
      await client.query(seedSql);
    }

    // 4. Run user query and track execution time
    const start = process.hrtime.bigint();
    try {
      const userRes = await client.query(userSql);
      const end = process.hrtime.bigint();
      executionTimeMs = Number(end - start) / 1_000_000; // convert nanoseconds to milliseconds

      userResults = {
        rows: Array.isArray(userRes) ? userRes[userRes.length - 1].rows : userRes.rows,
        fields: Array.isArray(userRes)
          ? userRes[userRes.length - 1].fields.map((f: any) => ({ name: f.name, dataTypeID: f.dataTypeID }))
          : userRes.fields.map((f: any) => ({ name: f.name, dataTypeID: f.dataTypeID })),
      };
    } catch (e: any) {
      // User query itself failed (syntax error, table/column name mismatch, timeout)
      error = e.message || "Unknown execution error";
    }

    // 5. If user query succeeded, run solution query to match outputs
    if (!error && solutionSql && solutionSql.trim() !== "") {
      try {
        const solRes = await client.query(solutionSql);
        solutionResults = {
          rows: Array.isArray(solRes) ? solRes[solRes.length - 1].rows : solRes.rows,
          fields: Array.isArray(solRes)
            ? solRes[solRes.length - 1].fields.map((f: any) => ({ name: f.name, dataTypeID: f.dataTypeID }))
            : solRes.fields.map((f: any) => ({ name: f.name, dataTypeID: f.dataTypeID })),
        };
      } catch (e: any) {
        // Solution itself failed (shouldn't happen on prod challenges, but capture it)
        console.error("Solution query execution error:", e);
        error = `Internal system validation error: ${e.message}`;
      }
    }
  } catch (e: any) {
    // Top level database setup failure (e.g. database URL unreachable, syntax error in DDL/Seeds)
    error = `Database configuration or sandbox setup error: ${e.message}`;
  } finally {
    try {
      // 6. Rollback transaction to wipe all changes
      await client.query("ROLLBACK;");
    } catch (rollbackErr) {
      console.error("Error during transaction rollback", rollbackErr);
    }
    // 7. Release connection
    client.release();
  }

  return {
    userResults,
    solutionResults,
    error,
    executionTimeMs: Math.round(executionTimeMs),
  };
}
