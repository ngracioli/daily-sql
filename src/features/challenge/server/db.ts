import { Pool } from "pg";

// Main Admin Pool for system data (challenges, profiles)
export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/dailysql",
  max: 10,
  idleTimeoutMillis: 30000,
});

// Sandboxed Runner Pool for running user queries
export const sandboxPool = new Pool({
  connectionString: process.env.SANDBOX_DATABASE_URL || "postgresql://daily_sql_runner:runnerpassword@localhost:5432/dailysql_sandbox",
  max: 20,
  idleTimeoutMillis: 10000,
});

// Handle pool level errors
dbPool.on("error", (err) => {
  console.error("Unexpected error on idle admin database client", err);
});

sandboxPool.on("error", (err) => {
  console.error("Unexpected error on idle sandbox database client", err);
});
