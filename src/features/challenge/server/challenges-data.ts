import { dbPool } from "./db";

export interface ChallengeDefinition {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  database: string;
  schema: {
    tableName: string;
    columns: { name: string; type: string }[];
  };
  initialData: Record<string, any>[];
  schemaSql: string;
  seedSql: string;
  solutionSql: string;
  checkOrder: boolean;
}

function mapRowToChallenge(row: any): ChallengeDefinition {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty as "Easy" | "Medium" | "Hard",
    database: row.database,
    schema: {
      tableName: row.schema_table_name,
      columns: row.schema_columns,
    },
    initialData: row.initial_data,
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

