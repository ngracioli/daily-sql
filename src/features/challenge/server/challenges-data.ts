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

export const CHALLENGES: Record<number, ChallengeDefinition> = {
  42: {
    id: 42,
    title: "Filter active user accounts.",
    description: "Select the id, username, and email of all users who have logged in within the last 30 days.",
    category: "Filtering",
    difficulty: "Easy",
    database: "PostgreSQL",
    schema: {
      tableName: "users",
      columns: [
        { name: "id", type: "integer" },
        { name: "username", type: "varchar(100)" },
        { name: "email", type: "varchar(255)" },
        { name: "last_login", type: "timestamp" },
      ],
    },
    initialData: [
      {
        id: 1,
        username: "alice_jones",
        email: "alice@example.com",
        last_login: "2026-05-20T10:23:00.000Z",
      },
      {
        id: 2,
        username: "bob_smith",
        email: "bob@example.com",
        last_login: "2025-11-01T14:45:00.000Z",
      },
      {
        id: 3,
        username: "charlie_brown",
        email: "charlie@example.com",
        last_login: "2026-06-02T09:12:00.000Z",
      },
    ],
    schemaSql: `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        last_login TIMESTAMP NOT NULL
      );
    `,
    seedSql: `
      INSERT INTO users (id, username, email, last_login) VALUES
      (1, 'alice_jones', 'alice@example.com', '2026-05-20 10:23:00'),
      (2, 'bob_smith', 'bob@example.com', '2025-11-01 14:45:00'),
      (3, 'charlie_brown', 'charlie@example.com', '2026-06-02 09:12:00');
    `,
    // Assuming NOW() represents June 18 2026 for mock consistency, or regular query
    // Let's use simple date logic matching the seed details
    solutionSql: `
      SELECT id, username, email FROM users
      WHERE last_login > '2026-06-18 22:53:59'::timestamp - INTERVAL '30 days';
    `,
    checkOrder: false,
  },
};

export function getDailyChallenge(): ChallengeDefinition {
  // Return the default challenge
  return CHALLENGES[42];
}
