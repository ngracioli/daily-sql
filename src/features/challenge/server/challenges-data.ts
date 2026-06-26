import { dbPool } from "./db";

export interface ChallengeDefinition {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  database: string;
  schema: {
    tables: Record<string, { name: string; type: string }[]>;
  };
  initialData: Record<string, Record<string, any>[]>;
  schemaSql: string;
  seedSql: string;
  solutionSql: string;
  checkOrder: boolean;
}

function mapRowToChallenge(row: any): ChallengeDefinition {
  let tables: Record<string, { name: string; type: string }[]> = {};
  let initialData: Record<string, any[]> = {};

  if (Array.isArray(row.schema_columns)) {
    tables[row.schema_table_name] = row.schema_columns;
  } else if (row.schema_columns && typeof row.schema_columns === "object") {
    tables = row.schema_columns;
  }

  if (Array.isArray(row.initial_data)) {
    initialData[row.schema_table_name] = row.initial_data;
  } else if (row.initial_data && typeof row.initial_data === "object") {
    initialData = row.initial_data;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty as "Easy" | "Medium" | "Hard",
    database: row.database,
    schema: {
      tables,
    },
    initialData,
    schemaSql: row.schema_sql,
    seedSql: row.seed_sql,
    solutionSql: row.solution_sql,
    checkOrder: row.check_order,
  };
}

export async function getDailyChallenge(): Promise<ChallengeDefinition> {
  const result = await dbPool.query("SELECT * FROM challenges ORDER BY id ASC");
  const challenges = result.rows;
  if (challenges.length === 0) {
    throw new Error("No challenges found in the database.");
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = dayOfYear % challenges.length;
  const row = challenges[index];

  return mapRowToChallenge(row);
}

export async function getChallengeById(id: number): Promise<ChallengeDefinition | null> {
  const result = await dbPool.query("SELECT * FROM challenges WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return null;
  }
  return mapRowToChallenge(result.rows[0]);
}

