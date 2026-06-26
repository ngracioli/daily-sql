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
    solutionSql: `
      SELECT id, username, email FROM users
      WHERE last_login > '2026-06-18 22:53:59'::timestamp - INTERVAL '30 days';
    `,
    checkOrder: false,
  },
  101: {
    id: 101,
    title: "Identify premium orders.",
    description: "Select the id, customer_id, and total_amount of all orders where the total_amount is greater than 150.00, ordered by total_amount in descending order.",
    category: "Filtering",
    difficulty: "Easy",
    database: "PostgreSQL",
    schema: {
      tableName: "orders",
      columns: [
        { name: "id", type: "integer" },
        { name: "customer_id", type: "integer" },
        { name: "total_amount", type: "numeric(10,2)" },
        { name: "order_date", type: "date" },
      ],
    },
    initialData: [
      { id: 1, customer_id: 10, total_amount: 250.50, order_date: "2026-06-01" },
      { id: 2, customer_id: 11, total_amount: 99.99, order_date: "2026-06-02" },
      { id: 3, customer_id: 10, total_amount: 180.00, order_date: "2026-06-03" },
      { id: 4, customer_id: 12, total_amount: 45.00, order_date: "2026-06-04" },
    ],
    schemaSql: `
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL,
        order_date DATE NOT NULL
      );
    `,
    seedSql: `
      INSERT INTO orders (id, customer_id, total_amount, order_date) VALUES
      (1, 10, 250.50, '2026-06-01'),
      (2, 11, 99.99, '2026-06-02'),
      (3, 10, 180.00, '2026-06-03'),
      (4, 12, 45.00, '2026-06-04');
    `,
    solutionSql: `
      SELECT id, customer_id, total_amount FROM orders
      WHERE total_amount > 150.00
      ORDER BY total_amount DESC;
    `,
    checkOrder: true,
  },
  102: {
    id: 102,
    title: "Find inactive customers.",
    description: "Select the id and name of customers who have never placed any orders. Order the results by customer id in ascending order.",
    category: "Joins & Subqueries",
    difficulty: "Medium",
    database: "PostgreSQL",
    schema: {
      tableName: "customers",
      columns: [
        { name: "id", type: "integer" },
        { name: "name", type: "varchar(100)" },
        { name: "country", type: "varchar(50)" },
      ],
    },
    initialData: [
      { id: 1, name: "Alice", country: "USA" },
      { id: 2, name: "Bob", country: "Canada" },
      { id: 3, name: "Charlie", country: "UK" },
    ],
    schemaSql: `
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        country VARCHAR(50) NOT NULL
      );
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL
      );
    `,
    seedSql: `
      INSERT INTO customers (id, name, country) VALUES
      (1, 'Alice', 'USA'),
      (2, 'Bob', 'Canada'),
      (3, 'Charlie', 'UK');
      INSERT INTO orders (id, customer_id, total_amount) VALUES
      (1, 1, 50.00),
      (2, 3, 120.00);
    `,
    solutionSql: `
      SELECT c.id, c.name FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      WHERE o.customer_id IS NULL
      ORDER BY c.id ASC;
    `,
    checkOrder: true,
  },
};

export function getDailyChallenge(): ChallengeDefinition {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const challengeKeys = Object.keys(CHALLENGES).map(Number).sort((a, b) => a - b);
  const index = dayOfYear % challengeKeys.length;
  const challengeId = challengeKeys[index];

  return CHALLENGES[challengeId];
}
